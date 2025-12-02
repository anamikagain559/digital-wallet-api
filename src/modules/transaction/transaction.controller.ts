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
    getAllTransactions: async (req: AuthRequest, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const {
      type,
      status,
      initiatedBy,
      minAmount,
      maxAmount,
      fromWallet,
      toWallet,
      startDate,
      endDate,
      search,
    } = req.query;

    // Base filter
    const filter: any = {};

    // Type filter (case-insensitive)
    if (type) {
      filter.type = { $regex: new RegExp(`^${type}$`, "i") };
    }

    // Status filter
    if (status) {
      filter.status = { $regex: new RegExp(`^${status}$`, "i") };
    }

    // Initiated By filter
    if (initiatedBy) {
      filter["initiatedBy.kind"] = { $regex: new RegExp(`^${initiatedBy}$`, "i") };
    }

    // Wallet filters
    if (fromWallet) filter.fromWallet = fromWallet;
    if (toWallet) filter.toWallet = toWallet;

    // Amount range
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    // Search via description
    if (search) {
      filter.description = { $regex: search as string, $options: "i" };
    }

    // Date range
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);

      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const [items, total] = await Promise.all([
      TransactionModel.find(filter)
        .populate("fromWallet")
        .populate("toWallet")
        .populate("initiatedBy.user")
        .populate("initiatedBy.agent")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      TransactionModel.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: { page, limit, total },
    });
  }, 
  deleteTransaction: async (req: ExRequest, res: Response) => {
  try {
  const { id } = req.params as { id: string }; // ✅ properly typed

    const deleted = await TransactionModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete transaction",
      error: (error as Error).message,
    });
  }
},


};
