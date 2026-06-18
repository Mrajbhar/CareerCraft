import { Router } from "express";
import auth from "../middleware/auth.js";
import requirePro from "../middleware/requirePro.js";
import { generateSummary, polishBullets, reviewResume, generateCover, tailorResume, mockInterview, writeEmail, optimizeLinkedIn, quantifyBullets, gapAnalysis, solveHint, solveSolution } from "../controllers/aiController.js";

const router = Router();
router.use(auth);

router.post("/summary", generateSummary);
router.post("/bullets", polishBullets);
router.post("/review", reviewResume);
router.post("/cover", generateCover);

// Pro-only AI features
router.post("/tailor", requirePro, tailorResume);
router.post("/interview", requirePro, mockInterview);

// AI tools (free to use; Pro gets the higher-quality model)
router.post("/email", writeEmail);
router.post("/linkedin", optimizeLinkedIn);
router.post("/quantify", quantifyBullets);
router.post("/gap", gapAnalysis);

// Problem help
router.post("/hint", solveHint);
router.post("/solution", requirePro, solveSolution);

export default router;