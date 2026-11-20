import { Router } from "express";
import * as controller from "../controllers/boards.controller.js";

const router = Router();

router.get("/", controller.listBoards);
router.post("/", controller.createBoard);
router.get("/:id", controller.getBoard);
router.patch("/:id", controller.updateBoard);
router.delete("/:id", controller.deleteBoard);

export default router;