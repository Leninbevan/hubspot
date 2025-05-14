import express from "express";
import { createBoard } from "../controllers/boardControllers.js";

const router = express.Router();

// router.get("/getBoard",getboard);
router.post("/createBoard", createBoard);

export default router;
