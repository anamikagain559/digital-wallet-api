import express from "express";

import { TransactionController } from "./transaction.controller";

const txRouter = express.Router();

txRouter.get("/me",  TransactionController.myHistory);
export default txRouter;