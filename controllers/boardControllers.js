import { generateBoard } from "../services/boardService.js";
import boardItemModal from "../modals/boardItemsModal.js";

export const createBoard = async (req, res, next) => {
  try {
    const existingEventId = await boardItemModal.findOne({ eventId: req.body.eventId })
    if (existingEventId) {
      return res.status(403).json({ success:false,message: 'Board Item already available with this Event Id.' });
    }
    const newBoardItem = await new boardItemModal(req.body);
    await newBoardItem.save();
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
