import { createBoard, getboard } from '../controllers/boardController';
import * as boardService from '../services/boardService';

describe('boardController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {}; // Mock request object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createBoard', () => {
    it('should respond with 200 and data on success', async () => {
      const mockResponse = { statusCode: 200, statusMessage: 'Created' };
      jest.spyOn(boardService, 'generateBoard').mockResolvedValue(mockResponse);

      await createBoard(req, res);

      expect(boardService.generateBoard).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should respond with 400 on error', async () => {
      const mockError = { message: 'Something went wrong' };
      jest.spyOn(boardService, 'generateBoard').mockRejectedValue(mockError);

      await createBoard(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getboard', () => {
    it('should respond with 200 and data on success', async () => {
      const mockResponse = { statusCode: 200, statusMessage: 'Fetched' };
      jest.spyOn(boardService, 'getBoard').mockResolvedValue(mockResponse);

      await getboard(req, res);

      expect(boardService.getBoard).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should respond with 400 on error', async () => {
      const mockError = { message: 'Error occurred' };
      jest.spyOn(boardService, 'getBoard').mockRejectedValue(mockError);

      await getboard(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(mockError);
    });
  });
});
