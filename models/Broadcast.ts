import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBroadcast extends Document {
  message: string;
  messageType: "text" | "image" | "video";
  chatIds: string[];
  mediaUrl?: string;
  successful: number;
  failed: number;
  results: Array<{
    chatId: string;
    success: boolean;
    error?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const BroadcastSchema = new Schema<IBroadcast>(
  {
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    messageType: {
      type: String,
      enum: ["text", "image", "video"],
      default: "text",
    },
    chatIds: {
      type: [String],
      required: [true, "Chat IDs are required"],
    },
    mediaUrl: {
      type: String,
    },
    successful: {
      type: Number,
      default: 0,
    },
    failed: {
      type: Number,
      default: 0,
    },
    results: [
      {
        chatId: String,
        success: Boolean,
        error: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Broadcast: Model<IBroadcast> =
  mongoose.models.Broadcast || mongoose.model<IBroadcast>("Broadcast", BroadcastSchema);

export default Broadcast;
