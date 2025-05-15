import express from "express";
import { createBoard } from "../controllers/boardControllers.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const checkTokenExpiry = async (req, res, next) => {
    const header = req.headers['authorization'];

    if (header !== undefined) {
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
        res.status(403).json({ success: 'false', message: 'Unauthorized access' });
    }
}

/**
 * @swagger
 * /api/v1/board/createBoard:
 *   post:
 *     summary: Create board Items
 *     security:
 *       - bearerAuth: []  # Requires JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: "155446"
 *               eventType:
 *                 type: string
 *                 example: "deal.propertyChange"
 *               propertyName:
 *                 type: string
 *                 example: "dealstage"
 *               objectId:
 *                 type: string
 *                 example: "56789"
 *               objectType:
 *                 type: string
 *                 example: "DEAL"
 *               propertyValue:
 *                 type: string
 *                 example: "closedwon"
 *               dealName:
 *                 type: string
 *                 example: "ACM test1"
 *               dealAmount:
 *                 type: string
 *                 example: "25000"
 *               contactEmail:
 *                 type: string
 *                 example: "john.doe@acme.com"
 *     responses:
 *       200:
 *         description: Successfully created a board
 *       400:
 *         description: Bad Request
 */

router.post("/createBoard", checkTokenExpiry, createBoard);

export default router;
