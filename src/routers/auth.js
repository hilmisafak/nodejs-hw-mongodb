import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import validateBody from "../middlewares/validateBody.js";
import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from "../schemas/authSchemas.js";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserController,
  sendResetEmailController,
  resetPasswordController,
} from "../controllers/auth.js";

const router = Router();

router.post("/register", validateBody(registerUserSchema), ctrlWrapper(registerUserController));
router.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginUserController));
router.post("/logout", ctrlWrapper(logoutUserController));
router.post("/refresh", ctrlWrapper(refreshUserController));
router.post("/send-reset-email", validateBody(requestResetEmailSchema), ctrlWrapper(sendResetEmailController));
router.post("/reset-pwd", validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));
export default router;
