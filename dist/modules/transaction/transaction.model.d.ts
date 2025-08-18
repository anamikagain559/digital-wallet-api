import mongoose, { Types } from "mongoose";
import { TransactionStatus, TransactionType } from "./transaction.constant";
export interface ITransaction {
    _id: Types.ObjectId;
    type: TransactionType;
    amount: number;
    fee: number;
    fromWallet?: Types.ObjectId;
    toWallet?: Types.ObjectId;
    initiatedBy: {
        kind: "USER" | "AGENT" | "SYSTEM";
        user?: Types.ObjectId;
        agent?: Types.ObjectId;
    };
    status: TransactionStatus;
    description?: string;
    meta?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const TransactionModel: mongoose.Model<ITransaction, {}, {}, {}, mongoose.Document<unknown, {}, ITransaction, {}, {}> & ITransaction & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=transaction.model.d.ts.map