"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../middlewares/checkAuth");
const transaction_controller_1 = require("./transaction.controller");
const user_interface_1 = require("../user/user.interface");
const txRouter = express_1.default.Router();
txRouter.get("/me", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.USER, user_interface_1.Role.AGENT), transaction_controller_1.TransactionController.myHistory);
txRouter.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), transaction_controller_1.TransactionController.getAllTransactions);
txRouter.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), // only admin can delete; modify if needed
transaction_controller_1.TransactionController.deleteTransaction);
exports.default = txRouter;
