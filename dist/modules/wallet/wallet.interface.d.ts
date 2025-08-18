import { Types } from "mongoose";
export interface IWallet {
    user: Types.ObjectId;
    balance: number;
    walletType: "user" | "agent";
    currency: string;
    isActive: boolean;
    transactions: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=wallet.interface.d.ts.map