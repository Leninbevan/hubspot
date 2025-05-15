import { generateBoard, getBoard } from "../services/boardService.js";

export const createBoard = async (req, res) => {
  try {
    const getBoardResponse = await getBoard(req);

    if (getBoardResponse.statusCode !== 200) {
      return res.status(400).json({
        statusCode: 400,
        message: "Failed to fetch board data",
        error: getBoardResponse.error,
      });
    }
    const response = await generateBoard(getBoardResponse.data);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const getboard = async (req, res) => {
  try {
    const response = await getBoard(req);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};
