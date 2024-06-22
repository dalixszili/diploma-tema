import express from "express";
import {
  findMe,
  verifyEmail,
  logIn,
  logOut,
  register,
  resetPassword,
  resetPasswordRequest,
  checkResetPswLink,
  changeAdmiPassword,
  updateAdminData,
} from "../controllers/Auth.js";
import {
  addJudgeToCategory,
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/UsersController.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.get("/me", findMe);
router.get("/users/:id/verify/:token", verifyEmail);
router.get("/users/:id/checkresetlink/:token", checkResetPswLink);
router.post("/users", createUser);
router.post("/addjudge", addJudgeToCategory);
router.post("/register", register);
router.post("/users/resetpasswordrequest", resetPasswordRequest);
router.post("/login", logIn);
router.patch("/users/:id", updateUser);
router.patch("/users/delete/:id", deleteUser);
router.patch("/users/:id/resetpassword/:token", resetPassword);
router.patch("/users/changeadminpsw/:id", changeAdmiPassword);
router.patch("/users/updateadmindata/:id", updateAdminData);
router.delete("/logout", logOut);

export default router;
