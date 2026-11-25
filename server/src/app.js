import express from "express";
import cors from "cors";
import { logger } from "./middleware/logger.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import boardsRouter from "./routes/boards.routes.js";
import authRouter from "./routes/auth.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/boards", boardsRouter);
app.use("/api/auth", authRouter);

app.use(notFound);
app.use(errorHandler);