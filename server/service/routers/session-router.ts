import { Router } from "express";
import {
  createSessionController,
  updateSessionController,
  fetchSessionsByProctorIdController,
  fetchSessionsByCoderIdController,
  fetchSessionByIdController,
} from "../controller/session-controller";

const router = Router();

// Create a new session
router.post("/", createSessionController);

// Update session status
router.put("/:id", updateSessionController);

// Fetch sessions by proctor ID
router.get("/proctor/:id", fetchSessionsByProctorIdController);

// Fetch sessions by coder ID
router.get("/coder/:id", fetchSessionsByCoderIdController);

// Fetch session by ID
router.get("/:id", fetchSessionByIdController);

export default router;
