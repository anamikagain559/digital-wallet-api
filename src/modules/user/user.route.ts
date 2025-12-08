import { Router } from "express";
import { checkAuth } from "../../modules/middlewares/checkAuth";
const router = Router()
import { UserControllers } from "./user.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Role } from "../user/user.interface";

router.post("/register",validateRequest(createUserZodSchema), UserControllers.createUser);
router.get("/all-users", UserControllers.getAllUsers)
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe)
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser)

router.patch(
  "/block-unblock/:id",
 
  UserControllers.blockOrUnblockUser 
);
router.post(
  "/create-agent",validateRequest(createUserZodSchema),checkAuth(Role.ADMIN),
  UserControllers.createAgent
);
router.get(
  "/admin-analytics",
  UserControllers.getAdminAnalytics
);
router.post(
  "/all-users",checkAuth(Role.ADMIN),
  UserControllers.getAllUsers
);
router.patch("/:id", validateRequest(updateUserZodSchema),checkAuth(Role.ADMIN), UserControllers.updateUser);

router.patch("/agent/approve/:id", checkAuth(Role.ADMIN), UserControllers.approveAgent);

router.patch("/agent/suspend/:id", checkAuth(Role.ADMIN), UserControllers.suspendAgent);
router.get("/admin/overview", checkAuth(Role.ADMIN), UserControllers.getAdminAnalytics);
export const UserRoutes = router;