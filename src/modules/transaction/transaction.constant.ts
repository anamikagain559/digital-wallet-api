export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  TRANSFER = "TRANSFER",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
  FEE = "FEE",
  COMMISSION = "COMMISSION",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REVERSED = "REVERSED",
}
