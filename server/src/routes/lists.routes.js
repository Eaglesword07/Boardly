import { Router } from "express";
import * as controller from "../controllers/lists.controller.js";
import * as cardsController from "../controllers/cards.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.patch("/:id", controller.updateList);
router.delete("/:id", controller.deleteList);
router.post("/:listId/cards", cardsController.createCard);

export default router;