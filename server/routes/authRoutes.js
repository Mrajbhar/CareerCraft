import { Router } from "express";
import auth from "../middleware/auth.js";
import { signup, login, googleAuth, forgotPassword, resetPassword, me } from "../controllers/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);
router.get("/me", auth, me);

export default router;