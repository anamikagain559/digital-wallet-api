import { Request as ExRequest, Response } from "express";
import { WalletService } from "./wallet.service";
import { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends ExRequest {
  user: JwtPayload & { userId: string; role: string };
}

export const WalletController = {
  create: async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const wallet = await WalletService.createWallet(req.user.userId);
    res.status(201).json({ success: true, data: wallet });
  },
getMyWallet: async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const wallet = await WalletService.getWalletByUserId(req.user.userId);
    res.json({ success: true, data: wallet });
  },

  getAll: async (req: Request, res: Response) => {
    const wallets = await WalletService.getAllWallets();
    res.json({ success: true, data: wallets });
  },

  block: async (req: AuthRequest, res: Response) => {
    const wallet = await WalletService.blockWallet(req.params.id);
    res.json({ success: true, message: "Wallet blocked", data: wallet });
  },

  unblock: async (req: AuthRequest, res: Response) => {
    const wallet = await WalletService.unblockWallet(req.params.id);
    res.json({ success: true, message: "Wallet unblocked", data: wallet });
  },

delete: async (req: ExRequest, res: Response) => {
  const { id } = req.params as { id: string }; // ✅ properly typed
  const wallet = await WalletService.deleteWallet(id); // ✅ use id directly
  res.json({ success: true, message: "Wallet deleted", data: wallet });
},
  me: async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const wallet = await WalletService.getMyWallet(req.user.userId);
    res.json({ success: true, data: wallet });
  },

  deposit: async (req: AuthRequest, res: Response) => {

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { amount } = req.body;
    const wallet = await WalletService.deposit(req.user.userId, amount);
    res.status(200).json({ success: true, message: "Deposited", data: wallet });
  },

  withdraw: async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { amount } = req.body;
    const wallet = await WalletService.withdraw(req.user.userId, amount);
    res.status(200).json({ success: true, message: "Withdrawn", data: wallet });
  },

  transfer: async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { toUserId, amount } = req.body;
    const result = await WalletService.transfer(req.user.userId, toUserId, amount);
    res.status(200).json({ success: true, message: "Transferred", data: result });
  },

  agentCashIn: async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { userId, amount } = req.body;
    const wallet = await WalletService.agentCashIn(req.user.userId, userId, amount);
    res.status(200).json({ success: true, message: "Cash-in successful", data: wallet });
  },

  agentCashOut: async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { userId, amount } = req.body;
    const wallet = await WalletService.agentCashOut(req.user.userId, userId, amount);
    res.status(200).json({ success: true, message: "Cash-out successful", data: wallet });
  },
  getOverview: async (req: AuthRequest, res: Response) =>  {
    
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = req.user.userId;
      const role = req.user.role;
      const overview = await WalletService.getOverview(userId, role);
      res.status(200).json({
        success: true,
        data: overview,
      });
    
    }
};



