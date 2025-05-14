import { generateBoard, getBoard } from "../services/boardService.js";

export const createBoard = async (req, res) => {
  try {
    const response = await generateBoard(req);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
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
