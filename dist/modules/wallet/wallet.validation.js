"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentCashOutSchema = exports.agentCashInSchema = exports.transferSchema = exports.withdrawSchema = exports.depositSchema = void 0;
const zod_1 = require("zod");
const wallet_constant_1 = require("./wallet.constant");
exports.depositSchema = zod_1.z.object({
    amount: zod_1.z
        .number({ message: "amount must be a number" })
        .min(wallet_constant_1.MIN_TOPUP_AMOUNT, `Minimum deposit is ${wallet_constant_1.MIN_TOPUP_AMOUNT}`),
});
exports.withdrawSchema = zod_1.z.object({
    amount: zod_1.z
        .number({ message: "amount must be a number" })
        .min(wallet_constant_1.MIN_WITHDRAW_AMOUNT, `Minimum withdraw is ${wallet_constant_1.MIN_WITHDRAW_AMOUNT}`),
});
exports.transferSchema = zod_1.z.object({
    toUserId: zod_1.z.string().nonempty("toUserId is required"),
    amount: zod_1.z
        .number({ message: "amount must be a number" })
        .min(wallet_constant_1.MIN_TRANSFER_AMOUNT, `Minimum transfer is ${wallet_constant_1.MIN_TRANSFER_AMOUNT}`),
});
exports.agentCashInSchema = zod_1.z.object({
    userId: zod_1.z.string().nonempty("userId is required"),
    amount: zod_1.z
        .number({ message: "amount must be a number" })
        .min(wallet_constant_1.MIN_TOPUP_AMOUNT, `Minimum cash-in is ${wallet_constant_1.MIN_TOPUP_AMOUNT}`),
});
exports.agentCashOutSchema = zod_1.z.object({
    userId: zod_1.z.string().nonempty("userId is required"),
    amount: zod_1.z
        .number({ message: "amount must be a number" })
        .min(wallet_constant_1.MIN_WITHDRAW_AMOUNT, `Minimum cash-out is ${wallet_constant_1.MIN_WITHDRAW_AMOUNT}`),
});
