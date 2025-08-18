import mongoose, { Schema, Types } from "mongoose";
import { TransactionStatus, TransactionType } from "./transaction.constant";

export interface ITransaction {
  _id: Types.ObjectId;
  type: TransactionType;
  amount: number;
  fee: number; // applied fee (if any)
  fromWallet?: Types.ObjectId; // for transfer/withdraw
  toWallet?: Types.ObjectId; // for transfer/deposit/cash-in
  initiatedBy: {
    kind: "USER" | "AGENT" | "SYSTEM";
    user?: Types.ObjectId; // ref: User
    agent?: Types.ObjectId; // ref: User (role=agent)
  };
  status: TransactionStatus;
  description?: string;
  meta?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    type: { type: String, enum: Object.values(TransactionType), required: true },
    amount: { type: Number, required: true, min: 0 },
    fee: { type: Number, required: true, default: 0 },
    fromWallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    toWallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    initiatedBy: {
      kind: { type: String, enum: ["USER", "AGENT", "SYSTEM"], required: true },
      user: { type: Schema.Types.ObjectId, ref: "User" },
      agent: { type: Schema.Types.ObjectId, ref: "User" },
    },
    status: { type: String, enum: Object.values(TransactionStatus), default: TransactionStatus.COMPLETED },
    description: { type: String },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const TransactionModel = mongoose.model<ITransaction>("Transaction", transactionSchema);