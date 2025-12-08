"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const wallet_service_1 = require("./wallet.service");
exports.WalletController = {
    create: async (req, res) => {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const wallet = await wallet_service_1.WalletService.createWallet(req.user.userId);
        res.status(201).json({ success: true, data: wallet });
    },
    getMyWallet: async (req, res) => {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const wallet = await wallet_service_1.WalletService.getWalletByUserId(req.user.userId);
        res.json({ success: true, data: wallet });
    },
    getAll: async (req, res) => {
        const wallets = await wallet_service_1.WalletService.getAllWallets();
        res.json({ success: true, data: wallets });
    },
    block: async (req, res) => {
        const wallet = await wallet_service_1.WalletService.blockWallet(req.params.id);
        res.json({ success: true, message: "Wallet blocked", data: wallet });
    },
    unblock: async (req, res) => {
        const wallet = await wallet_service_1.WalletService.unblockWallet(req.params.id);
        res.json({ success: true, message: "Wallet unblocked", data: wallet });
    },
    delete: async (req, res) => {
        const { id } = req.params; // ✅ properly typed
        const wallet = await wallet_service_1.WalletService.deleteWallet(id); // ✅ use id directly
        res.json({ success: true, message: "Wallet deleted", data: wallet });
    },
    me: async (req, res) => {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const wallet = await wallet_service_1.WalletService.getMyWallet(req.user.userId);
        res.json({ success: true, data: wallet });
    },
    deposit: async (req, res) => {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const { amount } = req.body;
        const wallet = await wallet_service_1.WalletService.deposit(req.user.userId, amount);
        res.status(200).json({ success: true, message: "Deposited", data: wallet });
    },
    withdraw: async (req, res) => {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const { amount } = req.body;
        const wallet = await wallet_service_1.WalletService.withdraw(req.user.userId, amount);
        res.status(200).json({ success: true, message: "Withdrawn", data: wallet });
    },
    transfer: async (req, res) => {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const { toUserId, amount } = req.body;
        const result = await wallet_service_1.WalletService.transfer(req.user.userId, toUserId, amount);
        res.status(200).json({ success: true, message: "Transferred", data: result });
    },
    agentCashIn: async (req, res) => {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const { userId, amount } = req.body;
        const wallet = await wallet_service_1.WalletService.agentCashIn(req.user.userId, userId, amount);
        res.status(200).json({ success: true, message: "Cash-in successful", data: wallet });
    },
    agentCashOut: async (req, res) => {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const { userId, amount } = req.body;
        const wallet = await wallet_service_1.WalletService.agentCashOut(req.user.userId, userId, amount);
        res.status(200).json({ success: true, message: "Cash-out successful", data: wallet });
    },
    getOverview: async (req, res) => {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const userId = req.user.userId;
        const role = req.user.role;
        const overview = await wallet_service_1.WalletService.getOverview(userId, role);
        res.status(200).json({
            success: true,
            data: overview,
        });
    }
};
