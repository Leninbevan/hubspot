import express from "express";
import { createBoard, getboard } from "../controllers/boardControllers.js";

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

/**
 * @swagger
 * /api/v1/board/getBoardItems:
 *   get:
 *     summary: Retrieve all board items
 *     responses:
 *       200:
 *         description: A list of board items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "abc123"
 *                   name:
 *                     type: string
 *                     example: "Sample Board"
 *                   validity:
 *                     type: boolean
 *                     example: true
 *       500:
 *         description: Server error
 */

router.get("/getBoardItems", getboard);

export default router;
