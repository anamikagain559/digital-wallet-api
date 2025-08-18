import mongoose, { Types } from "mongoose";
import { WalletStatus } from "./wallet.constant";
export interface IWallet {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    balance: number;
    status: WalletStatus;
    currency: "BDT" | "USD";
    createdAt: Date;
    updatedAt: Date;
}
export declare const WalletModel: mongoose.Model<IWallet, {}, {}, {}, mongoose.Document<unknown, {}, IWallet, {}, {}> & IWallet & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=wallet.model.d.ts.map