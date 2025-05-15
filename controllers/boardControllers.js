import { generateBoard } from "../services/boardService.js";

export const createBoard = async (req, res, next) => {
  try {
    const response = await generateBoard(req.body);
    res.status(200).json(response);
  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message,
      details: error.details || undefined,
    });
  }
};
