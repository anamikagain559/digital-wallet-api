import express from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { TransactionController } from "./transaction.controller";
import { Role } from "../user/user.interface";
const txRouter = express.Router();

txRouter.get("/me",  checkAuth(Role.USER),  TransactionController.myHistory);
export default txRouter;