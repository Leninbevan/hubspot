import express from "express";
import { createBoard, getboard } from "../controllers/boardControllers.js";

const router = express.Router();

// router.get("/getBoard",getboard);
router.post("/createBoard", createBoard);
router.get('/getBoardItems', getboard);

export default router;
