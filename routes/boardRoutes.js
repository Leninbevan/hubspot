import express from "express";
import { createBoard } from "../controllers/boardControllers.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/board/createBoard:
 *   post:
 *     summary: Create board Items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               validity:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully created a board
 *       400:
 *         description: Bad Request
*/

router.post("/createBoard", createBoard);

export default router;
