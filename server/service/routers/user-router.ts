import { Router } from "express";

import {
  loginController,
  signUpController,
  findAllActiveUsersController,
  deleteUserController,
  resetPasswordController,
} from "../controller/user-controller";

const router = Router();

router.post("/", signUpController);
router.delete("/:id", deleteUserController);
router.put("/:id", resetPasswordController);
router.post("/login", loginController);
router.get("/active-users", findAllActiveUsersController);

export default router;
