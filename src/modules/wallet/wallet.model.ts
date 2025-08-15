import mongoose, { Schema, Types } from "mongoose";
import { WalletStatus } from "./wallet.constant";

export interface IWallet {
  _id: Types.ObjectId;
  user: Types.ObjectId; // ref: User
  balance: number;
  status: WalletStatus;
  currency: "BDT" | "USD"; // keep simple; default BDT
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, required: true, default: 50 },
    status: { type: String, enum: Object.values(WalletStatus), default: WalletStatus.ACTIVE },
    currency: { type: String, enum: ["BDT", "USD"], default: "BDT" },
  },
  { timestamps: true }
);

export const WalletModel = mongoose.model<IWallet>("Wallet", walletSchema);