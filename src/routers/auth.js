import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import validateBody from "../middlewares/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../schemas/authSchemas.js";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserController,
} from "../controllers/auth.js";

const router = Router();

router.post("/register", validateBody(registerUserSchema), ctrlWrapper(registerUserController));
router.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginUserController));
router.post("/logout", ctrlWrapper(logoutUserController));
router.post("/refresh", ctrlWrapper(refreshUserController));
export default router;
