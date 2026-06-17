import { Router } from "express";
import auth from "../middleware/auth.js";
import requirePro from "../middleware/requirePro.js";
import {
  generateSummary,
  polishBullets,
  reviewResume,
  generateCover,
  tailorResume,
  mockInterview,
  writeEmail,
  optimizeLinkedIn,
  quantifyBullets,
  gapAnalysis,
} from "../controllers/aiController.js";

const router = Router();
router.use(auth);

router.post("/summary", generateSummary);
router.post("/bullets", polishBullets);
router.post("/review", reviewResume);
router.post("/cover", generateCover);

router.post("/tailor", requirePro, tailorResume);
router.post("/interview", requirePro, mockInterview);

router.post("/email", writeEmail);
router.post("/linkedin", optimizeLinkedIn);
router.post("/quantify", quantifyBullets);
router.post("/gap", gapAnalysis);

export default router;
