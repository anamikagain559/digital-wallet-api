import { Request, Response } from "express";
import { TransactionModel } from "./transaction.model";

export const TransactionController = {
  myHistory: async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query as any;
    const wallet = await (await import("../wallet/wallet.model")).WalletModel.findOne({ user: req.user.id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    const filter = { $or: [{ fromWallet: wallet._id }, { toWallet: wallet._id }] };
    const [items, total] = await Promise.all([
      TransactionModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((+page - 1) * +limit)
        .limit(+limit),
      TransactionModel.countDocuments(filter),
    ]);

    res.json({ data: items, page: +page, limit: +limit, total });
  },
};
