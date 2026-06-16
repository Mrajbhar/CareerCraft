import { Router } from "express";
import auth from "../middleware/auth.js";
import { getPlans, createOrder, verifyPayment } from "../controllers/billingController.js";

const router = Router();
router.get("/plans", getPlans);            // public
router.post("/checkout", auth, createOrder);
router.post("/verify", auth, verifyPayment);

export default router;