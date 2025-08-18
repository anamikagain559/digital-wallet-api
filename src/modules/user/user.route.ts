import { Router } from "express";
import { checkAuth } from "../../modules/middlewares/checkAuth";
const router = Router()
import { UserControllers } from "./user.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Role } from "../user/user.interface";
router.post("/register",validateRequest(createUserZodSchema), UserControllers.createUser);
router.get("/all-users", UserControllers.getAllUsers)
router.patch("/:id", validateRequest(updateUserZodSchema),UserControllers.updateUser)
router.post(
  "/create-agent",validateRequest(createUserZodSchema),checkAuth(Role.ADMIN),
  UserControllers.createAgent
);

export const UserRoutes = router;