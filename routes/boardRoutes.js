import express from "express";
import { createBoard } from "../controllers/boardControllers.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const checkTokenExpiry = async (req, res, next) => {
    const header = req.headers['authorization'];
    if (typeof header !== undefined) {
        const bearer = header.split(' ');
        const token = bearer[1];
        try {
            const decoded = jwt.decode(token);
            if (decoded.uid && decoded.per && decoded.actid) {
                if (req.method.toLowerCase() === 'post' && (decoded.per).includes('write')) {
                    next()
                }
                else {
                    return res.status(400).json({ success: 'false', message: 'Invalid token.' });
                }
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: 'false', message: 'Error decoding token' });
        }
    } else {
        console.log("Isnide");
        res.sendStatus(403);
    }
}

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

router.post("/createBoard", checkTokenExpiry, createBoard);

export default router;
