import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Bot from "@/models/Bot";

// PUT - Update a bot
export async function PUT(
  request: NextRequest,
   context : any
) {
  try {
    await connectDB();
    const { name, token, active } = await request.json();
    const  id   = await context.params.id;

    const bot = await Bot.findByIdAndUpdate(
      id,
      { name, token, active },
      { new: true, runValidators: true }
    );

    if (!bot) {
      return NextResponse.json(
        { error: "Bot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      bot: {
        id: (bot._id as any).toString(),
        name: bot.name,
        token: bot.token,
        active: bot.active,
      },
    });
  } catch (error: any) {
    console.error("Error updating bot:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update bot" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a bot
export async function DELETE(
  request: NextRequest,
   context : any
) {
  try {
    await connectDB();
    const id = await context.params.id;

    const bot = await Bot.findByIdAndDelete(id);

    if (!bot) {
      return NextResponse.json(
        { error: "Bot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bot deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting bot:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete bot" },
      { status: 500 }
    );
  }
}
