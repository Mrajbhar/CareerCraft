import { Router } from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import {
  listResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  setPublish,
  getPublicResume,
  listVersions,
  createVersion,
  restoreVersion,
  importResume,
} from "../controllers/resumeController.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 },
});

router.get("/public/:slug", getPublicResume);

router.use(auth);

router.get("/", listResumes);
router.get("/:id", getResume);
router.post("/", createResume);
router.post("/import", upload.single("file"), importResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);
router.post("/:id/publish", setPublish);
router.get("/:id/versions", listVersions);
router.post("/:id/versions", createVersion);
router.post("/:id/versions/:vid/restore", restoreVersion);

export default router;
