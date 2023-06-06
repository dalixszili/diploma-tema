import express from "express";
import {
  createMenu,
  deleteMenu,
  getMenuById,
  getMenusByOrder,
  getMenusByOrderWithPages,
  setMenuOrderById,
  updateMenu,
} from "../controllers/MenuController.js";

const router = express.Router();

router.get("/menus", getMenusByOrder);
router.get("/menuswithpages", getMenusByOrderWithPages);
router.get("/menu/:id", getMenuById);
router.post("/newmenu", createMenu);
router.patch("/updatemenu/:id", updateMenu);
router.patch("/deletemenu/:id", deleteMenu);
router.patch("/menus/setorder/:id", setMenuOrderById);

export default router;
