import { generateBoard, getBoard } from '../services/boardService';

describe('boardService', () => {
  describe('generateBoard', () => {
    it('should return a successful response', async () => {
      const result = await generateBoard({});
      expect(result).toEqual({
        statusCode: 200,
        statusMessage: 'Created successfully',
      });
    });

    it('should return an error response if an exception occurs', async () => {
      const result = await generateBoard({ triggerError: true });
      expect(result).toEqual({
        statusCode: 400,
        data: {},
        message: 'Validation error.',
        error: 'Test error',
      });
    });
  });

  describe('getBoard', () => {
    it('should return a successful response with sample data', async () => {
      const result = await getBoard({});
      expect(result).toEqual({
        statusCode: 200,
        statusMessage: 'Fetched successfully',
        data: {
          data: {
            boardId: 1,
            boardName: 'My Board',
            items: [
              {
                id: 1,
                itemId: '123456789',
                itemName: 'Deal 1',
                amount: 5000,
                status: 'closedwon',
              },
              {
                id: 2,
                itemId: '987654321',
                itemName: 'Deal 2',
                amount: 3000,
                status: 'closedwon',
              },
            ],
          },
        },
      });
    });

    it('should return an error response if an exception occurs', async () => {
      const result = await getBoard({ triggerError: true });
      expect(result).toEqual({
        statusCode: 400,
        data: {},
        message: 'Validation error.',
        error: 'Test error',
      });
    });
  });
});
