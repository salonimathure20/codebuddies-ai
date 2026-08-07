import { Router } from "express";
import multer from "multer";

import {
  s3Controller,
  getProfilePictureSignedUrl,
} from "../controller/s3-controller";

const router = Router();
const upload = multer();

router.post("/", s3Controller);
router.post(
  "/upload-profile-picture",
  upload.single("file"),
  getProfilePictureSignedUrl
);

export default router;
