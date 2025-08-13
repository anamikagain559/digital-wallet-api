import { Types } from "mongoose";

export interface IWallet {
  user: Types.ObjectId; // Reference to the wallet owner
  balance: number; // Current available balance
  walletType: "user" | "agent"; // Type of wallet
  currency: string; // Example: "BDT", "USD"
  isActive: boolean; // Whether the wallet is active
  transactions: Types.ObjectId[]; // References to transaction records
  createdAt?: Date;
  updatedAt?: Date;
}
