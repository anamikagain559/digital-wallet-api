import express from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { TransactionController } from "./transaction.controller";
import { Role } from "../user/user.interface";
const txRouter = express.Router();

txRouter.get("/me",  checkAuth(Role.ADMIN, Role.USER, Role.AGENT), TransactionController.myHistory as unknown as (req: any, res: any) => void);
txRouter.get(
  "/",
 checkAuth(Role.ADMIN),
  TransactionController.getAllTransactions as unknown as (req: any, res: any) => void
);
txRouter.delete(
  "/:id",
  checkAuth(Role.ADMIN), // only admin can delete; modify if needed
  TransactionController.deleteTransaction as unknown as (req: any, res: any) => void
);
export default txRouter;