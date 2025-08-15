export enum WalletStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export const MIN_TOPUP_AMOUNT = 10; // BDT
export const MIN_WITHDRAW_AMOUNT = 20; // BDT
export const MIN_TRANSFER_AMOUNT = 5; // BDT
export const MIN_BALANCE = 0; // keep at least 0 BDT

export const TRANSFER_FEE_PERCENT = 0.015; // 1.5%
export const WITHDRAW_FEE_PERCENT = 0.01; // 1%