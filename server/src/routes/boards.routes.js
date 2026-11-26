import { Router } from "express";
import * as controller from "../controllers/boards.controller.js";
import * as listsController from "../controllers/lists.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.get("/", controller.listBoards);
router.post("/", controller.createBoard);
router.get("/:id", controller.getBoard);
router.patch("/:id", controller.updateBoard);
router.delete("/:id", controller.deleteBoard);

router.get("/:boardId/lists", listsController.getLists);
router.post("/:boardId/lists", listsController.createList);

export default router;