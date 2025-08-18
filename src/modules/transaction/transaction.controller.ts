import { Request, Response } from "express";
import { TransactionModel } from "./transaction.model";

export const TransactionController = {
  myHistory: async (req: Request, res: Response) => {
    // Parse query parameters as numbers
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Check if req.user exists
    if (!req.user || !(req.user as any).id) {
      return res.status(401).json({ message: "Unauthorized: User not found in request" });
    }
    // Find the wallet for the logged-in user
    const wallet = await (await import("../wallet/wallet.model")).WalletModel.findOne({ user: (req.user as any).id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    const filter = { $or: [{ fromWallet: wallet._id }, { toWallet: wallet._id }] };

    const [items, total] = await Promise.all([
      TransactionModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      TransactionModel.countDocuments(filter),
    ]);

    res.json({ data: items, page, limit, total });
  },
};
