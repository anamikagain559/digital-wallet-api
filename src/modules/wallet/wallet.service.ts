/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wallet } from "./wallet.model";
import mongoose from "mongoose";

const createWallet = async (payload: any) => {
  const wallet = await Wallet.create(payload);
  return wallet;
};

const getMyWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ owner: userId });
  if (!wallet) {
    throw new Error("Wallet not found");
  }
  return wallet;
};

const getAllWallets = async () => {
  const wallets = await Wallet.find();
  return wallets;
};

const addMoney = async (walletId: string, amount: number) => {
  if (amount <= 0) throw new Error("Amount must be positive");

  const wallet = await Wallet.findById(walletId);
  if (!wallet) throw new Error("Wallet not found");

  wallet.balance += amount;
  await wallet.save();

  return wallet;
};

const withdrawMoney = async (walletId: string, amount: number) => {
  if (amount <= 0) throw new Error("Amount must be positive");

  const wallet = await Wallet.findById(walletId);
  if (!wallet) throw new Error("Wallet not found");
  if (wallet.balance < amount) throw new Error("Insufficient balance");

  wallet.balance -= amount;
  await wallet.save();

  return wallet;
};

const transferMoney = async (fromWalletId: string, toWalletId: string, amount: number) => {
  if (amount <= 0) throw new Error("Amount must be positive");
  if (fromWalletId === toWalletId) throw new Error("Cannot transfer to the same wallet");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const fromWallet = await Wallet.findById(fromWalletId).session(session);
    const toWallet = await Wallet.findById(toWalletId).session(session);

    if (!fromWallet || !toWallet) throw new Error("Wallet not found");
    if (fromWallet.balance < amount) throw new Error("Insufficient balance");

    fromWallet.balance -= amount;
    toWallet.balance += amount;

    await fromWallet.save({ session });
    await toWallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { fromWallet, toWallet };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteWallet = async (walletId: string) => {
  const result = await Wallet.findByIdAndDelete(walletId);
  if (!result) throw new Error("Wallet not found");
  return result;
};

export const walletService = {
  createWallet,
  getMyWallet,
  getAllWallets,
  addMoney,
  withdrawMoney,
  transferMoney,
  deleteWallet,
};
