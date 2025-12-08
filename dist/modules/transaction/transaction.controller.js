"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const transaction_model_1 = require("./transaction.model");
exports.TransactionController = {
    myHistory: async (req, res) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const { type, startDate, endDate } = req.query;
        if (!req.user?.userId) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }
        const { WalletModel } = await Promise.resolve().then(() => __importStar(require("../wallet/wallet.model")));
        const wallet = await WalletModel.findOne({ user: req.user.userId });
        if (!wallet)
            return res.status(404).json({ message: "Wallet not found" });
        // Base filter
        const filter = {
            $or: [{ fromWallet: wallet._id }, { toWallet: wallet._id }],
        };
        // Type filter (case-insensitive)
        if (type) {
            filter.type = { $regex: new RegExp(`^${type}$`, "i") }; // match regardless of case
        }
        // Date range filter
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate)
                filter.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // include full end day
                filter.createdAt.$lte = end;
            }
        }
        const [items, total] = await Promise.all([
            transaction_model_1.TransactionModel.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            transaction_model_1.TransactionModel.countDocuments(filter),
        ]);
        res.json({
            data: items,
            pagination: { page, limit, total },
        });
    },
    getAllTransactions: async (req, res) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const { type, status, initiatedBy, minAmount, maxAmount, fromWallet, toWallet, startDate, endDate, search, } = req.query;
        // Base filter
        const filter = {};
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
        if (fromWallet)
            filter.fromWallet = fromWallet;
        if (toWallet)
            filter.toWallet = toWallet;
        // Amount range
        if (minAmount || maxAmount) {
            filter.amount = {};
            if (minAmount)
                filter.amount.$gte = Number(minAmount);
            if (maxAmount)
                filter.amount.$lte = Number(maxAmount);
        }
        // Search via description
        if (search) {
            filter.description = { $regex: search, $options: "i" };
        }
        // Date range
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate)
                filter.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = end;
            }
        }
        const [items, total] = await Promise.all([
            transaction_model_1.TransactionModel.find(filter)
                .populate("fromWallet")
                .populate("toWallet")
                .populate("initiatedBy.user")
                .populate("initiatedBy.agent")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            transaction_model_1.TransactionModel.countDocuments(filter),
        ]);
        res.json({
            success: true,
            data: items,
            pagination: { page, limit, total },
        });
    },
    deleteTransaction: async (req, res) => {
        try {
            const { id } = req.params; // ✅ properly typed
            const deleted = await transaction_model_1.TransactionModel.findByIdAndDelete(id);
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
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete transaction",
                error: error.message,
            });
        }
    },
};
