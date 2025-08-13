import { Schema, model } from "mongoose";
import { IWallet } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Balance cannot be negative"],
    },
    walletType: {
      type: String,
      enum: ["user", "agent"],
      required: true,
    },
    currency: {
      type: String,
      default: "BDT",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
