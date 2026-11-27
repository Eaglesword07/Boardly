import { Router } from "express";
import * as controller from "../controllers/cards.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.patch("/:id", controller.updateCard);
router.delete("/:id", controller.deleteCard);

export default router;