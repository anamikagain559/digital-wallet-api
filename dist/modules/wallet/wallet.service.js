"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_model_1 = require("./wallet.model");
const transaction_model_1 = require("../transaction/transaction.model");
const transaction_constant_1 = require("../transaction/transaction.constant");
const wallet_constant_1 = require("./wallet.constant");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const ensureActive = (status) => {
    if (status !== wallet_constant_1.WalletStatus.ACTIVE) {
        throw new AppError_1.default(403, "Wallet is blocked");
    }
};
const withSession = async (fn) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const result = await fn(session);
        await session.commitTransaction();
        return result;
    }
    catch (e) {
        await session.abortTransaction();
        throw e;
    }
    finally {
        await session.endSession();
    }
};
exports.WalletService = {
    async createWallet(userId) {
        const exists = await wallet_model_1.WalletModel.findOne({ user: userId });
        if (exists)
            throw new AppError_1.default(400, "Wallet already exists");
        return await wallet_model_1.WalletModel.create({
            user: new mongoose_1.default.Types.ObjectId(userId),
            balance: 50,
            status: wallet_constant_1.WalletStatus.ACTIVE,
        });
    },
    async getWalletByUserId(userId) {
        const wallet = await wallet_model_1.WalletModel.findOne({ user: userId });
        if (!wallet)
            throw new AppError_1.default(404, "Wallet not found");
        return wallet;
    },
    async updateWalletBalance(userId, amount) {
        const wallet = await wallet_model_1.WalletModel.findOneAndUpdate({ user: userId }, { $inc: { balance: amount } }, { new: true });
        if (!wallet)
            throw new AppError_1.default(404, "Wallet not found");
        return wallet;
    },
    async blockWallet(walletId) {
        const wallet = await wallet_model_1.WalletModel.findByIdAndUpdate(walletId, { status: wallet_constant_1.WalletStatus.BLOCKED }, { new: true });
        if (!wallet)
            throw new AppError_1.default(404, "Wallet not found");
        return wallet;
    },
    async unblockWallet(walletId) {
        const wallet = await wallet_model_1.WalletModel.findByIdAndUpdate(walletId, { status: wallet_constant_1.WalletStatus.ACTIVE }, { new: true });
        if (!wallet)
            throw new AppError_1.default(404, "Wallet not found");
        return wallet;
    },
    async deleteWallet(walletId) {
        const wallet = await wallet_model_1.WalletModel.findByIdAndDelete(walletId);
        if (!wallet)
            throw new AppError_1.default(404, "Wallet not found");
        return wallet;
    },
    async getAllWallets() {
        return await wallet_model_1.WalletModel.find().populate("user", "name email role");
    },
    async getMyWallet(userId) {
        const wallet = await wallet_model_1.WalletModel.findOne({ user: userId });
        if (!wallet)
            throw new AppError_1.default(404, "Wallet not found");
        return wallet;
    },
    async deposit(userId, amount) {
        return withSession(async (session) => {
            const wallet = await wallet_model_1.WalletModel.findOne({ user: userId }).session(session);
            if (!wallet)
                throw new AppError_1.default(404, "Wallet not found");
            ensureActive(wallet.status);
            wallet.balance += amount;
            await wallet.save({ session });
            await transaction_model_1.TransactionModel.create([{
                    type: transaction_constant_1.TransactionType.DEPOSIT,
                    amount,
                    fee: 0,
                    toWallet: wallet._id,
                    initiatedBy: { kind: "USER", user: wallet.user },
                    status: transaction_constant_1.TransactionStatus.COMPLETED,
                    description: "User deposited money",
                    meta: { channel: "SELF_TOPUP" },
                }], { session });
            return wallet;
        });
    },
    async withdraw(userId, amount) {
        return withSession(async (session) => {
            const wallet = await wallet_model_1.WalletModel.findOne({ user: userId }).session(session);
            if (!wallet)
                throw new AppError_1.default(404, "Wallet not found");
            ensureActive(wallet.status);
            const fee = Math.ceil(amount * wallet_constant_1.WITHDRAW_FEE_PERCENT);
            const totalDebit = amount + fee;
            if (wallet.balance - totalDebit < wallet_constant_1.MIN_BALANCE) {
                throw new AppError_1.default(400, "Insufficient balance");
            }
            wallet.balance -= totalDebit;
            await wallet.save({ session });
            await transaction_model_1.TransactionModel.create([{
                    type: transaction_constant_1.TransactionType.WITHDRAW,
                    amount,
                    fee,
                    fromWallet: wallet._id,
                    initiatedBy: { kind: "USER", user: wallet.user },
                    status: transaction_constant_1.TransactionStatus.COMPLETED,
                    description: "User withdrew money",
                }], { session });
            return wallet;
        });
    },
    async transfer(fromUserId, toUserId, amount) {
        if (fromUserId === toUserId) {
            throw new AppError_1.default(400, "Cannot transfer to self");
        }
        return withSession(async (session) => {
            const [fromWallet, toWallet] = await Promise.all([
                wallet_model_1.WalletModel.findOne({ user: fromUserId }).session(session),
                wallet_model_1.WalletModel.findOne({ user: toUserId }).session(session),
            ]);
            if (!fromWallet)
                throw new AppError_1.default(404, "Sender wallet not found");
            if (!toWallet)
                throw new AppError_1.default(404, "Receiver wallet not found");
            ensureActive(fromWallet.status);
            ensureActive(toWallet.status);
            const fee = Math.ceil(amount * wallet_constant_1.TRANSFER_FEE_PERCENT);
            const totalDebit = amount + fee;
            if (fromWallet.balance - totalDebit < wallet_constant_1.MIN_BALANCE) {
                throw new AppError_1.default(400, "Insufficient balance");
            }
            fromWallet.balance -= totalDebit;
            toWallet.balance += amount;
            await Promise.all([
                fromWallet.save({ session }),
                toWallet.save({ session }),
            ]);
            await transaction_model_1.TransactionModel.create([{
                    type: transaction_constant_1.TransactionType.TRANSFER,
                    amount,
                    fee,
                    fromWallet: fromWallet._id,
                    toWallet: toWallet._id,
                    initiatedBy: { kind: "USER", user: fromWallet.user },
                    status: transaction_constant_1.TransactionStatus.COMPLETED,
                    description: "User transferred money",
                    meta: { toUserId },
                }], { session });
            return { fromWallet, toWallet };
        });
    },
    async agentCashIn(agentId, userId, amount) {
        return withSession(async (session) => {
            const wallet = await wallet_model_1.WalletModel.findOne({ user: userId }).session(session);
            if (!wallet)
                throw new AppError_1.default(404, "Wallet not found");
            ensureActive(wallet.status);
            wallet.balance += amount;
            await wallet.save({ session });
            await transaction_model_1.TransactionModel.create([{
                    type: transaction_constant_1.TransactionType.CASH_IN,
                    amount,
                    fee: 0,
                    toWallet: wallet._id,
                    initiatedBy: { kind: "AGENT", agent: new mongoose_1.default.Types.ObjectId(agentId) },
                    status: transaction_constant_1.TransactionStatus.COMPLETED,
                    description: "Agent cash-in to user",
                }], { session });
            return wallet;
        });
    },
    async agentCashOut(agentId, userId, amount) {
        return withSession(async (session) => {
            const wallet = await wallet_model_1.WalletModel.findOne({ user: userId }).session(session);
            if (!wallet)
                throw new AppError_1.default(404, "Wallet not found");
            ensureActive(wallet.status);
            const fee = 0; // Optional: add fee logic
            const totalDebit = amount + fee;
            if (wallet.balance - totalDebit < wallet_constant_1.MIN_BALANCE) {
                throw new AppError_1.default(400, "Insufficient balance");
            }
            wallet.balance -= totalDebit;
            await wallet.save({ session });
            await transaction_model_1.TransactionModel.create([{
                    type: transaction_constant_1.TransactionType.CASH_OUT,
                    amount,
                    fee,
                    fromWallet: wallet._id,
                    initiatedBy: { kind: "AGENT", agent: new mongoose_1.default.Types.ObjectId(agentId) },
                    status: transaction_constant_1.TransactionStatus.COMPLETED,
                    description: "Agent cash-out from user",
                }], { session });
            return wallet;
        });
    },
};
