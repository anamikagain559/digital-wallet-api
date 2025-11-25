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


router.post("/create", checkAuth(Role.ADMIN, Role.USER, Role.AGENT), WalletController.create as unknown as (req: any, res: any) => void);
router.get(
  "/me",
  checkAuth(Role.ADMIN, Role.USER, Role.AGENT),
  WalletController.me as unknown as (req: any, res: any) => void
);

router.get(
  "/getall",
  checkAuth(Role.ADMIN),
  WalletController.getAll as unknown as (req: any, res: any) => void
);

router.patch(
  "/block/:id",
  checkAuth(Role.ADMIN),
  WalletController.block as unknown as (req: any, res: any) => void
);

router.patch(
  "/unblock/:id",
  checkAuth(Role.ADMIN),
  WalletController.unblock as unknown as (req: any, res: any) => void
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN),
  WalletController.delete as unknown as (req: any, res: any) => void
);

// User wallet operations
router.post(
  "/deposit",
  checkAuth(Role.USER),
  validateRequest(depositSchema),
  WalletController.deposit as unknown as (req: any, res: any) => void
);

router.post(
  "/withdraw",
  checkAuth(Role.USER),
  validateRequest(withdrawSchema),
  WalletController.withdraw as unknown as (req: any, res: any) => void
);

router.post(
  "/transfer",
  checkAuth(Role.USER),
  validateRequest(transferSchema),
  WalletController.transfer as unknown as (req: any, res: any) => void
);

// Agent wallet operations
router.post(
  "/agent/cash-in",
  checkAuth(Role.AGENT),
  validateRequest(agentCashInSchema),
  WalletController.agentCashIn as unknown as (req: any, res: any) => void
);


router.get("/overview", checkAuth(Role.USER,Role.AGENT), WalletController.getOverview as unknown as (req: any, res: any) => void);


router.post(
  "/agent/cash-out",
  checkAuth(Role.AGENT),
  validateRequest(agentCashOutSchema),
  WalletController.agentCashOut as unknown as (req: any, res: any) => void
);
router.delete("/:id", checkAuth(Role.ADMIN), WalletController.delete  as unknown as (req: any, res: any) => void);


export const WalletRoutes = router;
