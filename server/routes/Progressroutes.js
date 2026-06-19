import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  getProgress,
  toggleSolved,
  addSubmission,
} from "../controllers/progressController.js";

const router = Router();
router.use(auth);
router.get("/", getProgress);
router.post("/solve", toggleSolved);
router.post("/submit", addSubmission);

export default router;
