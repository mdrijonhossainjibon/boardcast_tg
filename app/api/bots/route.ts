import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Bot from "@/models/Bot";

// GET - Fetch all bots
export async function GET() {
  try {
    await connectDB();
    const bots = await Bot.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      bots: bots.map(bot => ({
        id: (bot._id as any).toString(),
        name: bot.name,
        token: bot.token,
        active: bot.active,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch bots" },
      { status: 500 }
    );
  }
}

// POST - Create a new bot
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, token, active } = await request.json();

    // Validate input
    if (!name || !token) {
      return NextResponse.json(
        { error: "Name and token are required" },
        { status: 400 }
      );
    }

    // Check if token already exists
    const existingBot = await Bot.findOne({ token });
    if (existingBot) {
      return NextResponse.json(
        { error: "Bot with this token already exists" },
        { status: 400 }
      );
    }

    const bot = await Bot.create({
      name,
      token,
      active: active !== undefined ? active : true,
    });

    return NextResponse.json({
      success: true,
      bot: {
        id: (bot._id as any).toString(),
        name: bot.name,
        token: bot.token,
        active: bot.active,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating bot:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create bot" },
      { status: 500 }
    );
  }
}
