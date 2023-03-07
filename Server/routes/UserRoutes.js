import express from "express";
import { findMe, logIn, logOut } from "../controllers/Auth.js";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/UsersController.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/me", findMe);
router.post("/login", logIn);
router.delete("/logout", logOut);

export default router;
