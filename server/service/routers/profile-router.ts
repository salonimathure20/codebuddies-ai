import express from "express";
import {
  createProfile,
  getProfileByUserId,
  updateProfile,
} from "../controller/profile-controller";

const router = express.Router();

router.post("/", createProfile);
router.get("/:id", getProfileByUserId);
router.put("/:id", updateProfile);

export default router;
