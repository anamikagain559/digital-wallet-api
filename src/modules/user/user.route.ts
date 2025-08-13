import { Router } from "express";

const router = Router()
import { UserControllers } from "./user.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

router.post("/register",validateRequest(createUserZodSchema), UserControllers.createUser);
router.get("/all-users", UserControllers.getAllUsers)
router.patch("/:id", validateRequest(updateUserZodSchema),UserControllers.updateUser)

export const UserRoutes = router;