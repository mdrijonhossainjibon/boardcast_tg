import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBot extends Document {
  name: string;
  token: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BotSchema = new Schema<IBot>(
  {
    name: {
      type: String,
      required: [true, "Bot name is required"],
      trim: true,
    },
    token: {
      type: String,
      required: [true, "Bot token is required"],
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Bot: Model<IBot> = mongoose.models.Bot || mongoose.model<IBot>("Bot", BotSchema);

export default Bot;
