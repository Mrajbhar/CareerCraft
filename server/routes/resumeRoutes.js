import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  listResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
} from "../controllers/resumeController.js";

const router = Router();
router.use(auth); 

router.get("/", listResumes);
router.get("/:id", getResume);
router.post("/", createResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);

export default router;
