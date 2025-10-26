import { NextRequest, NextResponse } from "next/server";
import { Telegraf } from "telegraf";
import { InputFile } from "telegraf/types";
import connectDB from "@/lib/mongodb";
import Broadcast from "@/models/Broadcast";
import Bot from "@/models/Bot";

// Configure route segment to handle larger payloads
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds timeout

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    
    
    let formData: FormData;
    try {
      // Clone the request to avoid consuming the body
      const clonedRequest = request.clone();
      formData = await clonedRequest.formData();
    } catch (parseError: any) {
      console.error("FormData parse error:", parseError);
      console.error("Error stack:", parseError.stack);
      
      // Try to read as text to see what we're actually receiving
      try {
        const bodyText = await request.text();
        console.log("Request body (first 500 chars):", bodyText.substring(0, 500));
      } catch (textError) {
        console.error("Could not read body as text:", textError);
      }
      
      return NextResponse.json(
        { error: "Failed to parse request body as FormData: " + parseError.message },
        { status: 400 }
      );
    }
    
    const message = formData.get("message") as string;
    const messageType = formData.get("messageType") as string;
    const chatIdsStr = formData.get("chatIds") as string;
    const mediaFile = formData.get("media") as File | null;
    const botId = formData.get("botId") as string | null;
 

    // Parse chat IDs
    let chatIds: string[] = [];
    try {
      chatIds = JSON.parse(chatIdsStr);
    } catch {
      return NextResponse.json(
        { error: "Invalid chat IDs format" },
        { status: 400 }
      );
    }

    // Validate input
    if (!message || !chatIds || !Array.isArray(chatIds) || chatIds.length === 0) {
      return NextResponse.json(
        { error: "Message and chat IDs are required" },
        { status: 400 }
      );
    }

    // Validate media for image/video types
    if ((messageType === "image" || messageType === "video") && !mediaFile) {
      return NextResponse.json(
        { error: `${messageType} file is required for ${messageType} messages` },
        { status: 400 }
      );
    }

    // Get bot token from database or environment
    let botToken: string;
    
    if (botId) {
      // Use specific bot from database
      const bot = await Bot.findById(botId);
      if (!bot) {
        return NextResponse.json(
          { error: "Bot not found" },
          { status: 404 }
        );
      }
      if (!bot.active) {
        return NextResponse.json(
          { error: "Bot is not active" },
          { status: 400 }
        );
      }
      botToken = bot.token;
    } else {
      // Use default bot from environment
      botToken = process.env.TELEGRAM_BOT_TOKEN || "";
      if (!botToken) {
        return NextResponse.json(
          { error: "No bot selected and TELEGRAM_BOT_TOKEN not configured" },
          { status: 500 }
        );
      }
    }

    // Initialize Telegraf bot
    const telegramBot = new Telegraf(botToken);

    // Convert File to Buffer for Telegram
    let mediaBuffer: Buffer | null = null;
    let fileName: string | null = null;
    
    if (mediaFile) {
      const arrayBuffer = await mediaFile.arrayBuffer();
      mediaBuffer = Buffer.from(arrayBuffer);
      fileName = mediaFile.name;
    }

    // Send messages to all chat IDs
    const results = await Promise.allSettled(
      chatIds.map(async (chatId) => {
        try {
          if (messageType === "text") {
            // Send text only
            await telegramBot.telegram.sendMessage(chatId, message);
          } else if (messageType === "image" && mediaBuffer) {
            // Send photo with caption
            await telegramBot.telegram.sendPhoto(chatId, {
              source: mediaBuffer,
              filename: fileName || "image.jpg"
            }, {
              caption: message
            });
          } else if (messageType === "video" && mediaBuffer) {
            // Send video with caption
            await telegramBot.telegram.sendVideo(chatId, {
              source: mediaBuffer,
              filename: fileName || "video.mp4"
            }, {
              caption: message
            });
          }
          return { chatId, success: true };
        } catch (error: any) {
          return { chatId, success: false, error: error.message };
        }
      })
    );

    // Count successes and failures
    const successful = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
    const failed = results.length - successful;

    // Save broadcast to database
    const broadcastResults = results.map((r) => 
      r.status === "fulfilled" ? r.value : { chatId: "", success: false, error: "Unknown error" }
    );

    await Broadcast.create({
      message,
      messageType,
      chatIds,
      successful,
      failed,
      results: broadcastResults,
    });

    return NextResponse.json({
      message: `Broadcast sent! Success: ${successful}, Failed: ${failed}`,
      results: broadcastResults,
      successful,
      failed,
    });
  } catch (error: any) {
    console.error("Broadcast error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send broadcast" },
      { status: 500 }
    );
  }
}
