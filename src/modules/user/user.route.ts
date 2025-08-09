import { Router } from "express";

const router = Router()
import { UserController } from "./user.controller";

router.post("/register", UserController.createUser);
router.get("/all-users", UserController.getAllUsers)

export const UserRoutes = router;