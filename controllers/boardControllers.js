import { generateBoard } from "../services/boardService.js";

export const createBoard = async (req, res) => {
  try {
    const response = await generateBoard(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

