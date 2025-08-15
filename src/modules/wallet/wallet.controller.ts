import { Request, Response } from "express";
import { WalletService } from "./wallet.service";

export const WalletController = {

  // Create wallet for the logged-in user
  create: async (req: Request, res: Response) => {
    const wallet = await WalletService.createWallet(req.user!.userId);
    res.status(201).json({ success: true, data: wallet });
  },

  // Get the logged-in user's wallet
  getMyWallet: async (req: Request, res: Response) => {
    const wallet = await WalletService.getWalletByUserId(req.user!.userId);
    res.json({ success: true, data: wallet });
  },

  // Get all wallets (admin only)
  getAll: async (req: Request, res: Response) => {
    const wallets = await WalletService.getAllWallets();
    res.json({ success: true, data: wallets });
  },

  // Block a wallet (admin only)
  block: async (req: Request, res: Response) => {
    const wallet = await WalletService.blockWallet(req.params.id);
    res.json({ success: true, message: "Wallet blocked", data: wallet });
  },

  // Unblock a wallet (admin only)
  unblock: async (req: Request, res: Response) => {
    const wallet = await WalletService.unblockWallet(req.params.id);
    res.json({ success: true, message: "Wallet unblocked", data: wallet });
  },

  // Delete a wallet (admin only)
  delete: async (req: Request, res: Response) => {
    const wallet = await WalletService.deleteWallet(req.params.id);
    res.json({ success: true, message: "Wallet deleted", data: wallet });
  },

  // Alias for getting my wallet
  me: async (req: Request, res: Response) => {
    const wallet = await WalletService.getMyWallet(req.user!.userId);
    res.json({ success: true, data: wallet });
  },

  // Deposit money
  deposit: async (req: Request, res: Response) => {
    const { amount } = req.body;
    const wallet = await WalletService.deposit(req.user!.userId, amount);
    res.status(200).json({ success: true, message: "Deposited", data: wallet });
  },

  // Withdraw money
  withdraw: async (req: Request, res: Response) => {
    const { amount } = req.body;
    const wallet = await WalletService.withdraw(req.user!.userId, amount);
    res.status(200).json({ success: true, message: "Withdrawn", data: wallet });
  },

  // Transfer money to another user
  transfer: async (req: Request, res: Response) => {
    const { toUserId, amount } = req.body;
    const result = await WalletService.transfer(req.user!.userId, toUserId, amount);
    res.status(200).json({ success: true, message: "Transferred", data: result });
  },

  // Agent cash-in to user wallet
  agentCashIn: async (req: Request, res: Response) => {
    const { userId, amount } = req.body;
    const wallet = await WalletService.agentCashIn(req.user!.userId, userId, amount);
    res.status(200).json({ success: true, message: "Cash-in successful", data: wallet });
  },

  // Agent cash-out from user wallet
  agentCashOut: async (req: Request, res: Response) => {
    const { userId, amount } = req.body;
    const wallet = await WalletService.agentCashOut(req.user!.userId, userId, amount);
    res.status(200).json({ success: true, message: "Cash-out successful", data: wallet });
  }
};
