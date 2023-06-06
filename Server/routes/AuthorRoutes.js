import express from "express";
import {
  createAuthor,
  deleteAuthor,
  getAuthorById,
  updateAuthor,
} from "../controllers/AuthorController.js";

const router = express.Router();

router.post("/newauthor", createAuthor);
router.get("/author/:id", getAuthorById);
router.patch("/updateauthor/:id", updateAuthor);
router.patch("/deleteauthor/:id", deleteAuthor);

export default router;
