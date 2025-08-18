import mongoose from "mongoose";
export declare const WalletService: {
    createWallet(userId: string): Promise<mongoose.Document<unknown, {}, import("./wallet.model").IWallet, {}, {}> & import("./wallet.model").IWallet & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getWalletByUserId(userId: string): Promise<mongoose.Document<unknown, {}, import("./wallet.model").IWallet, {}, {}> & import("./wallet.model").IWallet & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateWalletBalance(userId: string, amount: number): Promise<mongoose.Document<unknown, {}, import("./wallet.model").IWallet, {}, {}> & import("./wallet.model").IWallet & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    blockWallet(walletId: string): Promise<mongoose.Document<unknown, {}, import("./wallet.model").IWallet, {}, {}> & import("./wallet.model").IWallet & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    unblockWallet(walletId: string): Promise<mongoose.Document<unknown, {}, import("./wallet.model").IWallet, {}, {}> & import("./wallet.model").IWallet & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteWallet(walletId: string): Promise<mongoose.Document<unknown, {}, import("./wallet.model").IWallet, {}, {}> & import("./wallet.model").IWallet & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllWallets(): Promise<(mongoose.Document<unknown, {}, import("./wallet.model").IWallet, {}, {}> & import("./wallet.model").IWallet & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getMyWallet(userId: string): Promise<mongoose.Document<unknown, {}, import("./wallet.model").IWallet, {}, {}> & import("./wallet.model").IWallet & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deposit(userId: string, amount: number): Promise<mongoose.Document<unknown, {}, import("./wallet.model").IWallet, {}, {}> & import("./wallet.model").IWallet & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    withdraw(userId: string, amount: number): Promise<mongoose.Document<unknown, {}, import("./wallet.model").IWallet, {}, {}> & import("./wallet.model").IWallet & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    transfer(fromUserId: string, toUserId: string, amount: number): Promise<{
        fromWallet: mongoose.Document<unknown, {}, import("./wallet.model").IWallet, {}, {}> & import("./wallet.model").IWallet & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        };
        toWallet: mongoose.Document<unknown, {}, import("./wallet.model").IWallet, {}, {}> & import("./wallet.model").IWallet & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    agentCashIn(agentId: string, userId: string, amount: number): Promise<mongoose.Document<unknown, {}, import("./wallet.model").IWallet, {}, {}> & import("./wallet.model").IWallet & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    agentCashOut(agentId: string, userId: string, amount: number): Promise<mongoose.Document<unknown, {}, import("./wallet.model").IWallet, {}, {}> & import("./wallet.model").IWallet & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
};
//# sourceMappingURL=wallet.service.d.ts.map