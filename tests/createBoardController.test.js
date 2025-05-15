import express from "express";
import request from "supertest";
import { createBoard } from "../controllers/boardControllers.js";
import * as boardService from "../services/boardService.js";
import boardItemModal from "../modals/boardItemsModal.js";

jest.mock("../services/boardService.js");
jest.mock("../modals/boardItemsModal.js");

const app = express();
app.use(express.json());
app.post("/api/v1/board/create", createBoard);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    details: err.details || null,
  });
});

describe("createBoard controller", () => {
  const mockPayload = {
    eventId: "event-123",
    dealName: "Test Deal",
    propertyValue: "closedwon",
    dealAmount: "1000",
    contactEmail: "test@example.com",
    objectType: "deal",
    objectId: "obj-123",
    propertyName: "stage",
    eventType: "change",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 403 if eventId already exists", async () => {
    boardItemModal.findOne.mockResolvedValue({ _id: "abc123" });

    const res = await request(app).post("/api/v1/board/create").send(mockPayload);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({
      success: false,
      message: "Board Item already available with this Event Id.",
    });
  });

  it("should create item and return success response", async () => {
    boardItemModal.findOne.mockResolvedValue(null);
    boardItemModal.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true),
    }));

    boardService.generateBoard.mockResolvedValue({
      statusCode: 200,
      statusMessage: "Item created successfully",
      itemId: "xyz456",
    });

    const res = await request(app).post("/api/v1/board/create").send(mockPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      statusCode: 200,
      statusMessage: "Item created successfully",
      itemId: "xyz456",
    });
  });

  it("should handle service error and pass it to next", async () => {
    boardItemModal.findOne.mockResolvedValue(null);
    boardItemModal.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true),
    }));

    boardService.generateBoard.mockRejectedValue({
      status: 500,
      message: "Something went wrong",
    });

    const res = await request(app).post("/api/v1/board/create").send(mockPayload);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      message: "Something went wrong",
      details: null,
    });
  });
});
