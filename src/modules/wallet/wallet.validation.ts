import { z } from "zod";
import { MIN_TOPUP_AMOUNT, MIN_TRANSFER_AMOUNT, MIN_WITHDRAW_AMOUNT } from "./wallet.constant";

export const depositSchema = z.object({
  amount: z.number({ required_error: "amount is required", invalid_type_error: "amount must be a number" }).min(MIN_TOPUP_AMOUNT, `Minimum deposit is ${MIN_TOPUP_AMOUNT}`),
});

export const withdrawSchema = z.object({
  amount: z.number({ required_error: "amount is required", invalid_type_error: "amount must be a number" }).min(MIN_WITHDRAW_AMOUNT, `Minimum withdraw is ${MIN_WITHDRAW_AMOUNT}`),
});

export const transferSchema = z.object({
  toUserId: z.string({ required_error: "toUserId is required" }),
  amount: z.number({ required_error: "amount is required", invalid_type_error: "amount must be a number" }).min(MIN_TRANSFER_AMOUNT, `Minimum transfer is ${MIN_TRANSFER_AMOUNT}`),
});

export const agentCashInSchema = z.object({
  userId: z.string({ required_error: "userId is required" }),
  amount: z.number({ required_error: "amount is required", invalid_type_error: "amount must be a number" }).min(MIN_TOPUP_AMOUNT, `Minimum cash-in is ${MIN_TOPUP_AMOUNT}`),
});

export const agentCashOutSchema = z.object({
  userId: z.string({ required_error: "userId is required" }),
  amount: z.number({ required_error: "amount is required", invalid_type_error: "amount must be a number" }).min(MIN_WITHDRAW_AMOUNT, `Minimum cash-out is ${MIN_WITHDRAW_AMOUNT}`),
});