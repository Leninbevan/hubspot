import axios from 'axios';
import { generateBoard, getBoard } from '../services/boardService';

jest.mock('axios');

describe('boardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateBoard', () => {
    it('should return success if board exists and name matches', async () => {
      axios.post.mockResolvedValueOnce({
        data: {
          data: {
            boards: [
              {
                id: 1234567890,
                name: 'My test2 board',
                columns: []
              }
            ]
          }
        }
      });

      const result = await generateBoard({});
      expect(result).toEqual({
        statusCode: 200,
        statusMessage: 'Created or updated successfully'
      });
    });

    it('should return success if board does not exist and it gets created', async () => {
      axios.post
        .mockResolvedValueOnce({ data: { data: { boards: [] } } }) // read board returns empty
        .mockResolvedValueOnce({ data: { data: { create_board: { id: 9876543210 } } } }); // create board

      const result = await generateBoard({});
      expect(result).toEqual({
        statusCode: 200,
        statusMessage: 'Created or updated successfully'
      });
    });

    it('should return success if board exists and name is updated', async () => {
      axios.post
        .mockResolvedValueOnce({ // board exists, name mismatch
          data: {
            data: {
              boards: [
                {
                  id: 1234567890,
                  name: 'Old Board Name',
                  columns: []
                }
              ]
            }
          }
        })
        .mockResolvedValueOnce({ data: { data: { update_board: true } } }); // update board

      const result = await generateBoard({});
      expect(result).toEqual({
        statusCode: 200,
        statusMessage: 'Created or updated successfully'
      });
    });

    it('should return error if exception is thrown', async () => {
      const result = await generateBoard({ triggerError: true });
      expect(result).toEqual({
        statusCode: 400,
        data: {},
        message: 'Validation error.',
        error: 'Test error'
      });
    });

    it('should return error if axios throws', async () => {
      axios.post.mockRejectedValueOnce(new Error('Network error'));
      const result = await generateBoard({});
      expect(result).toEqual({
        statusCode: 400,
        data: {},
        message: 'Validation error.',
        error: 'Network error'
      });
    });
  });

  describe('getBoard', () => {
    it('should return sample board data', async () => {
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
                status: 'closedwon'
              },
              {
                id: 2,
                itemId: '987654321',
                itemName: 'Deal 2',
                amount: 3000,
                status: 'closedwon'
              }
            ]
          }
        }
      });
    });

    it('should return error if getBoard throws', async () => {
      const result = await getBoard({ triggerError: true });
      expect(result).toEqual({
        statusCode: 400,
        data: {},
        message: 'Validation error.',
        error: 'Test error'
      });
    });
  });
});