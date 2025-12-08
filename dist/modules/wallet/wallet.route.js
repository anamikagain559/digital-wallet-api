"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = require("express");
const wallet_controller_1 = require("./wallet.controller");
const validateRequest_1 = require("../middlewares/validateRequest");
const checkAuth_1 = require("../middlewares/checkAuth");
const wallet_validation_1 = require("./wallet.validation");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.USER, user_interface_1.Role.AGENT), wallet_controller_1.WalletController.create);
router.get("/me", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.USER, user_interface_1.Role.AGENT), wallet_controller_1.WalletController.me);
router.get("/getall", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), wallet_controller_1.WalletController.getAll);
router.patch("/block/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), wallet_controller_1.WalletController.block);
router.patch("/unblock/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), wallet_controller_1.WalletController.unblock);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), wallet_controller_1.WalletController.delete);
// User wallet operations
router.post("/deposit", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(wallet_validation_1.depositSchema), wallet_controller_1.WalletController.deposit);
router.post("/withdraw", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(wallet_validation_1.withdrawSchema), wallet_controller_1.WalletController.withdraw);
router.post("/transfer", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(wallet_validation_1.transferSchema), wallet_controller_1.WalletController.transfer);
// Agent wallet operations
router.post("/agent/cash-in", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), (0, validateRequest_1.validateRequest)(wallet_validation_1.agentCashInSchema), wallet_controller_1.WalletController.agentCashIn);
router.get("/overview", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.AGENT), wallet_controller_1.WalletController.getOverview);
router.post("/agent/cash-out", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), (0, validateRequest_1.validateRequest)(wallet_validation_1.agentCashOutSchema), wallet_controller_1.WalletController.agentCashOut);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), wallet_controller_1.WalletController.delete);
exports.WalletRoutes = router;
