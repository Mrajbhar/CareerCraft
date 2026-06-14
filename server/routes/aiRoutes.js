import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  generateSummary,
  polishBullets,
  reviewResume,
  generateCover,
} from "../controllers/aiController.js";

const router = Router();
router.use(auth);

router.post("/summary", generateSummary);
router.post("/bullets", polishBullets);
router.post("/review", reviewResume);
router.post("/cover", generateCover);

export default router;
