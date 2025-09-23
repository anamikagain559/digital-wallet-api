import { Request as ExRequest, Response } from "express";
import { TransactionModel } from "./transaction.model";
import { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends ExRequest {
  user?: JwtPayload & { userId: string; role: string };
}

export const TransactionController = {
  myHistory: async (req: AuthRequest, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { type, startDate, endDate } = req.query;

    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const { WalletModel } = await import("../wallet/wallet.model");
    const wallet = await WalletModel.findOne({ user: req.user.userId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    // Base filter
    const filter: any = {
      $or: [{ fromWallet: wallet._id }, { toWallet: wallet._id }],
    };

    // Type filter (case-insensitive)
    if (type) {
      filter.type = { $regex: new RegExp(`^${type}$`, "i") }; // match regardless of case
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999); // include full end day
        filter.createdAt.$lte = end;
      }
    }

    const [items, total] = await Promise.all([
      TransactionModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      TransactionModel.countDocuments(filter),
    ]);

    res.json({
      data: items,
      pagination: { page, limit, total },
    });
  },
};
