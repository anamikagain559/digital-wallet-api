import mongoose, { ClientSession } from "mongoose";
import { WalletModel } from "./wallet.model";
import { TransactionModel } from "../transaction/transaction.model";
import { TransactionStatus, TransactionType } from "../transaction/transaction.constant";
import { MIN_BALANCE, WalletStatus, TRANSFER_FEE_PERCENT, WITHDRAW_FEE_PERCENT } from "./wallet.constant";
import AppError from "../../errorHelpers/AppError";

const ensureActive = (status: WalletStatus) => {
  if (status !== WalletStatus.ACTIVE) {
    throw new AppError(403, "Wallet is blocked");
  }
};

const withSession = async <T>(fn: (session: ClientSession) => Promise<T>): Promise<T> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await fn(session);
    await session.commitTransaction();
    return result;
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    await session.endSession();
  }
};

export const WalletService = {
  async createWallet(userId: string) {
    const exists = await WalletModel.findOne({ user: userId });
    if (exists) throw new AppError(400, "Wallet already exists");

    return await WalletModel.create({
      user: new mongoose.Types.ObjectId(userId),
      balance: 50,
      status: WalletStatus.ACTIVE,
    });
  },

  async getWalletByUserId(userId: string) {
    const wallet = await WalletModel.findOne({ user: userId });
    if (!wallet) throw new AppError(404, "Wallet not found");
    return wallet;
  },

  async updateWalletBalance(userId: string, amount: number) {
    const wallet = await WalletModel.findOneAndUpdate(
      { user: userId },
      { $inc: { balance: amount } },
      { new: true }
    );
    if (!wallet) throw new AppError(404, "Wallet not found");
    return wallet;
  },

  async blockWallet(walletId: string) {
    const wallet = await WalletModel.findByIdAndUpdate(
      walletId,
      { status: WalletStatus.BLOCKED },
      { new: true }
    );
    if (!wallet) throw new AppError(404, "Wallet not found");
    return wallet;
  },

  async unblockWallet(walletId: string) {
    const wallet = await WalletModel.findByIdAndUpdate(
      walletId,
      { status: WalletStatus.ACTIVE },
      { new: true }
    );
    if (!wallet) throw new AppError(404, "Wallet not found");
    return wallet;
  },

  async deleteWallet(walletId: string) {
    const wallet = await WalletModel.findByIdAndDelete(walletId);
    if (!wallet) throw new AppError(404, "Wallet not found");
    return wallet;
  },

  async getAllWallets() {
    return await WalletModel.find().populate("user", "name email role");
  },

  async getMyWallet(userId: string) {
    const wallet = await WalletModel.findOne({ user: userId });
    if (!wallet) throw new AppError(404, "Wallet not found");
    return wallet;
  },

  async deposit(userId: string, amount: number) {

    return withSession(async (session) => {
      const wallet = await WalletModel.findOne({ user: userId }).session(session);
      console.log("Wallet in service:", wallet);
      if (!wallet) throw new AppError(404, "Wallet not found");
      ensureActive(wallet.status);

      wallet.balance += amount;
      await wallet.save({ session });

      await TransactionModel.create([{
        type: TransactionType.DEPOSIT,
        amount,
        fee: 0,
        toWallet: wallet._id,
        initiatedBy: { kind: "USER", user: wallet.user },
        status: TransactionStatus.COMPLETED,
        description: "User deposited money",
        meta: { channel: "SELF_TOPUP" },
      }], { session });

      return wallet;
    });
  },

  async withdraw(userId: string, amount: number) {
    return withSession(async (session) => {
      const wallet = await WalletModel.findOne({ user: userId }).session(session);
      if (!wallet) throw new AppError(404, "Wallet not found");
      ensureActive(wallet.status);

      const fee = Math.ceil(amount * WITHDRAW_FEE_PERCENT);
      const totalDebit = amount + fee;
      if (wallet.balance - totalDebit < MIN_BALANCE) {
        throw new AppError(400, "Insufficient balance");
      }

      wallet.balance -= totalDebit;
      await wallet.save({ session });

      await TransactionModel.create([{
        type: TransactionType.WITHDRAW,
        amount,
        fee,
        fromWallet: wallet._id,
        initiatedBy: { kind: "USER", user: wallet.user },
        status: TransactionStatus.COMPLETED,
        description: "User withdrew money",
      }], { session });

      return wallet;
    });
  },

async transfer(fromUserId: string, toUserId: string, amount: number) {
  if (fromUserId === toUserId) {
    throw new AppError(400, "Cannot transfer to self");
  }

  return withSession(async (session) => {
    const [fromWallet, toWallet] = await Promise.all([
      WalletModel.findOne({ user: fromUserId }).session(session),
      WalletModel.findOne({ user: toUserId }).session(session),
    ]);

    if (!fromWallet) throw new AppError(404, "Sender wallet not found");
    if (!toWallet) throw new AppError(404, "Receiver wallet not found");

    ensureActive(fromWallet.status);
    ensureActive(toWallet.status);

    const fee = Math.ceil(amount * TRANSFER_FEE_PERCENT);
    const totalDebit = amount + fee;

    if (fromWallet.balance - totalDebit < MIN_BALANCE) {
      throw new AppError(400, "Insufficient balance");
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
    await TransactionModel.create(
      [
        {
          type: TransactionType.TRANSFER,
          amount,
          fee,
          fromWallet: fromWallet._id,
          toWallet: toWallet._id,
          initiatedBy: { kind: "USER", user: fromWallet.user },
          status: TransactionStatus.COMPLETED,
          description: "User transferred money",
          meta: { toUserId },
        },
      ],
      { session } // 🔑 VERY IMPORTANT
    );

    return { fromWallet, toWallet };
  });
},

async agentCashIn(agentId: string, userId: string, amount: number) {
  return withSession(async (session) => {

    // 1. Find AGENT wallet
    const agentWallet = await WalletModel.findOne({ user: agentId }).session(session);
    if (!agentWallet) throw new AppError(404, "Agent wallet not found");
    ensureActive(agentWallet.status);

    // Check if agent has enough balance
    if (agentWallet.balance < amount) {
      throw new AppError(400, "Insufficient agent balance");
    }

    // 2. Find USER wallet
    const userWallet = await WalletModel.findOne({ user: userId }).session(session);
    if (!userWallet) throw new AppError(404, "User wallet not found");
    ensureActive(userWallet.status);

    // 3. Deduct from Agent wallet
    agentWallet.balance -= amount;
    await agentWallet.save({ session });

    // 4. Add to User wallet
    userWallet.balance += amount;
    await userWallet.save({ session });

    // 5. Transaction Record
    await TransactionModel.create([{
      type: TransactionType.CASH_IN,
      amount,
      fee: 0,
      fromWallet: agentWallet._id,
      toWallet: userWallet._id,
      initiatedBy: { kind: "AGENT", agent: new mongoose.Types.ObjectId(agentId) },
      status: TransactionStatus.COMPLETED,
      description: "Agent cash-in to user"
    }], { session });

    return { agentWallet, userWallet };
  });
},

  async agentCashOut(agentId: string, userId: string, amount: number) {
    return withSession(async (session) => {
      const wallet = await WalletModel.findOne({ user: userId }).session(session);
      if (!wallet) throw new AppError(404, "Wallet not found");
      ensureActive(wallet.status);

      const fee = 0; // Optional: add fee logic
      const totalDebit = amount + fee;
      if (wallet.balance - totalDebit < MIN_BALANCE) {
        throw new AppError(400, "Insufficient balance");
      }

      wallet.balance -= totalDebit;
      await wallet.save({ session });

      await TransactionModel.create([{
        type: TransactionType.CASH_OUT,
        amount,
        fee,
        fromWallet: wallet._id,
        initiatedBy: { kind: "AGENT", agent: new mongoose.Types.ObjectId(agentId) },
        status: TransactionStatus.COMPLETED,
        description: "Agent cash-out from user",
      }], { session });

      return wallet;
    });
  },
};
