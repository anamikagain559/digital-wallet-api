import { Router } from "express";
import { WalletController } from "./wallet.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { checkAuth } from "../middlewares/checkAuth";
import {
  agentCashInSchema,
  agentCashOutSchema,
  depositSchema,
  transferSchema,
  withdrawSchema
} from "./wallet.validation";
import { Role } from "../user/user.interface";

const router = Router();



router.post("/create", checkAuth(Role.ADMIN, Role.USER, Role.AGENT), WalletController.create);
router.get("/me", checkAuth(Role.ADMIN, Role.USER, Role.AGENT), WalletController.getMyWallet);
router.get("/getall", checkAuth(Role.ADMIN), WalletController.getAll);
router.patch("/block/:id", checkAuth(Role.ADMIN), WalletController.block);
router.patch("/unblock/:id", checkAuth(Role.ADMIN), WalletController.unblock);
router.delete("/:id", checkAuth(Role.ADMIN), WalletController.delete);



router.get("/me", checkAuth(Role.USER, Role.AGENT, Role.ADMIN), WalletController.me);

router.post("/deposit", checkAuth(Role.USER), validateRequest(depositSchema), WalletController.deposit);
router.post("/withdraw", checkAuth(Role.USER), validateRequest(withdrawSchema), WalletController.withdraw);
router.post("/transfer", checkAuth(Role.USER), validateRequest(transferSchema), WalletController.transfer);

router.post("/agent/cash-in", checkAuth(Role.AGENT), validateRequest(agentCashInSchema), WalletController.agentCashIn);
router.post("/agent/cash-out", checkAuth(Role.AGENT), validateRequest(agentCashOutSchema), WalletController.agentCashOut);

export const WalletRoutes = router;
