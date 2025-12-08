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
            console.log("Wallet in service:", wallet);
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
            // ✅ Apply changes
            fromWallet.balance -= totalDebit;
            toWallet.balance += amount;
            // ✅ Save inside the same session
            await Promise.all([
                fromWallet.save({ session }),
                toWallet.save({ session }),
            ]);
            // ✅ Transaction must also use session
            await transaction_model_1.TransactionModel.create([
                {
                    type: transaction_constant_1.TransactionType.TRANSFER,
                    amount,
                    fee,
                    fromWallet: fromWallet._id,
                    toWallet: toWallet._id,
                    initiatedBy: { kind: "USER", user: fromWallet.user },
                    status: transaction_constant_1.TransactionStatus.COMPLETED,
                    description: "User transferred money",
                    meta: { toUserId },
                },
            ], { session } // 🔑 VERY IMPORTANT
            );
            return { fromWallet, toWallet };
        });
    },
    async agentCashIn(agentId, userId, amount) {
        return withSession(async (session) => {
            // 1. Find AGENT wallet
            const agentWallet = await wallet_model_1.WalletModel.findOne({ user: agentId }).session(session);
            if (!agentWallet)
                throw new AppError_1.default(404, "Agent wallet not found");
            ensureActive(agentWallet.status);
            // Check if agent has enough balance
            if (agentWallet.balance < amount) {
                throw new AppError_1.default(400, "Insufficient agent balance");
            }
            // 2. Find USER wallet
            const userWallet = await wallet_model_1.WalletModel.findOne({ user: userId }).session(session);
            if (!userWallet)
                throw new AppError_1.default(404, "User wallet not found");
            ensureActive(userWallet.status);
            // 3. Deduct from Agent wallet
            agentWallet.balance -= amount;
            await agentWallet.save({ session });
            // 4. Add to User wallet
            userWallet.balance += amount;
            await userWallet.save({ session });
            // 5. Transaction Record
            await transaction_model_1.TransactionModel.create([{
                    type: transaction_constant_1.TransactionType.CASH_IN,
                    amount,
                    fee: 0,
                    fromWallet: agentWallet._id,
                    toWallet: userWallet._id,
                    initiatedBy: { kind: "AGENT", agent: new mongoose_1.default.Types.ObjectId(agentId) },
                    status: transaction_constant_1.TransactionStatus.COMPLETED,
                    description: "Agent cash-in to user"
                }], { session });
            return { agentWallet, userWallet };
        });
    },
    async agentCashOut(agentId, userId, amount) {
        return withSession(async (session) => {
            console.log(agentId, userId, amount);
            const userWallet = await wallet_model_1.WalletModel.findOne({ user: userId }).session(session);
            if (!userWallet)
                throw new AppError_1.default(404, "User wallet not found");
            ensureActive(userWallet.status);
            // 2. Get agent wallet
            const agentWallet = await wallet_model_1.WalletModel.findOne({ user: agentId }).session(session);
            if (!agentWallet)
                throw new AppError_1.default(404, "Agent wallet not found");
            ensureActive(agentWallet.status);
            // 3. Check user balance
            const fee = 0;
            const totalDebit = amount + fee;
            if (userWallet.balance < totalDebit) {
                throw new AppError_1.default(400, "Insufficient balance");
            }
            // 4. Deduct from user
            userWallet.balance -= totalDebit;
            // 5. Add to agent
            agentWallet.balance += amount;
            // 6. Save
            await userWallet.save({ session });
            await agentWallet.save({ session });
            // 7. Log transaction
            await transaction_model_1.TransactionModel.create([
                {
                    type: transaction_constant_1.TransactionType.CASH_OUT,
                    amount,
                    fee,
                    fromWallet: userWallet._id,
                    toWallet: agentWallet._id,
                    initiatedBy: { kind: "AGENT", agent: new mongoose_1.default.Types.ObjectId(agentId) },
                    status: transaction_constant_1.TransactionStatus.COMPLETED,
                    description: "Agent cash-out from user to agent",
                }
            ], { session });
            return { userWallet, agentWallet };
        });
    },
    async getOverview(userId, role) {
        // 1️⃣ Get wallet
        const wallet = await wallet_model_1.WalletModel.findOne({ user: userId });
        if (!wallet)
            throw new AppError_1.default(404, "Wallet not found");
        // 2️⃣ Aggregate transactions
        let totalCashIn = 0;
        let totalCashOut = 0;
        if (role === "AGENT") {
            // Agent: transactions initiated by agent
            const cashInAgg = await transaction_model_1.TransactionModel.aggregate([
                { $match: { "initiatedBy.agent": new mongoose_1.default.Types.ObjectId(userId), type: transaction_constant_1.TransactionType.CASH_IN } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);
            const cashOutAgg = await transaction_model_1.TransactionModel.aggregate([
                { $match: { "initiatedBy.agent": new mongoose_1.default.Types.ObjectId(userId), type: transaction_constant_1.TransactionType.CASH_OUT } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);
            totalCashIn = cashInAgg[0]?.total || 0;
            totalCashOut = cashOutAgg[0]?.total || 0;
        }
        else {
            // User: transactions where wallet is involved
            const cashInAgg = await transaction_model_1.TransactionModel.aggregate([
                { $match: { toWallet: wallet._id, type: transaction_constant_1.TransactionType.CASH_IN } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);
            const cashOutAgg = await transaction_model_1.TransactionModel.aggregate([
                { $match: { fromWallet: wallet._id, type: transaction_constant_1.TransactionType.CASH_OUT } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);
            totalCashIn = cashInAgg[0]?.total || 0;
            totalCashOut = cashOutAgg[0]?.total || 0;
        }
        // 3️⃣ Latest 10 transactions
        const recentTransactions = await transaction_model_1.TransactionModel.find({
            $or: [
                { fromWallet: wallet._id },
                { toWallet: wallet._id },
                ...(role === "AGENT" ? [{ "initiatedBy.agent": userId }] : []),
            ],
        })
            .sort({ createdAt: -1 })
            .limit(10);
        return {
            walletBalance: wallet.balance,
            totalCashIn,
            totalCashOut,
            recentTransactions,
        };
    }
};
