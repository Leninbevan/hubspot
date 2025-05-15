import express from "express";
import request from "supertest";
import { createBoard } from "../controllers/boardControllers.js";
import * as boardService from "../services/boardService.js";

jest.mock("../services/boardService.js");

const app = express();
app.use(express.json());
app.post("/api/v1/board/create", createBoard);

// Capture errors with a test-friendly error middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    details: err.details || null,
  });
});

describe("createBoard controller", () => {
  const mockPayload = {
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

  it("should return 200 and result from generateBoard", async () => {
    boardService.generateBoard.mockResolvedValue({
      statusCode: 200,
      statusMessage: "Item created successfully",
      itemId: "xyz789",
    });

    const res = await request(app)
      .post("/api/v1/board/create")
      .send(mockPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      statusCode: 200,
      statusMessage: "Item created successfully",
      itemId: "xyz789",
    });
    expect(boardService.generateBoard).toHaveBeenCalledWith(mockPayload);
  });

  it("should handle errors from generateBoard and call next", async () => {
    boardService.generateBoard.mockRejectedValue({
      status: 400,
      message: "Missing required fields",
      details: [{ loc: ["body", "dealName"], msg: "Field required" }],
    });

    const res = await request(app)
      .post("/api/v1/board/create")
      .send({}); // sending empty payload

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      message: "Missing required fields",
      details: [{ loc: ["body", "dealName"], msg: "Field required" }],
    });
  });
});
