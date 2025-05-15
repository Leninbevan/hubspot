import axios from "axios";
import { generateBoard } from "../services/boardService.js";
import boardItemModal from "../modals/boardItemsModal.js";

jest.mock("axios");
jest.mock("../modals/boardItemsModal.js");

describe("generateBoard", () => {
  const validPayload = {
    eventId: "event-123",
    dealName: "Test Deal",
    propertyValue: "closedwon",
    dealAmount: "1200",
    contactEmail: "test@example.com",
    objectType: "deal",
    objectId: "obj-456",
    propertyName: "stage",
    eventType: "change",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new item if eventId is not found and data is valid", async () => {
    boardItemModal.findOne.mockResolvedValue(null);
    boardItemModal.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true),
    }));

    axios.post.mockResolvedValue({
      data: {
        data: {
          create_item: { id: "item123" },
        },
      },
    });

    const result = await generateBoard(validPayload);

    expect(boardItemModal.findOne).toHaveBeenCalledWith({ eventId: "event-123" });
    expect(result).toEqual({
      statusCode: 200,
      statusMessage: "Item created successfully",
      itemId: "item123",
    });
  });

  it("should throw a 403 error if eventId already exists", async () => {
    boardItemModal.findOne.mockResolvedValue({ eventId: "event-123" });

    await expect(generateBoard(validPayload)).rejects.toMatchObject({
      status: 403,
      message: "Board Item already available with this Event Id.",
    });
  });

  it("should throw a 400 error for missing required fields", async () => {
    const incompletePayload = {
      ...validPayload,
      dealName: null,
      contactEmail: undefined,
    };

    boardItemModal.findOne.mockResolvedValue(null);
    boardItemModal.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true),
    }));

    await expect(generateBoard(incompletePayload)).rejects.toMatchObject({
      status: 400,
      message: "Missing required fields",
      details: [
        { loc: ["body", "dealName"], msg: "Field required", type: "missing" },
        { loc: ["body", "contactEmail"], msg: "Field required", type: "missing" },
      ],
    });
  });

  it("should throw a 500 error if axios call fails", async () => {
    boardItemModal.findOne.mockResolvedValue(null);
    boardItemModal.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true),
    }));

    axios.post.mockRejectedValue(new Error("Network error"));

    await expect(generateBoard(validPayload)).rejects.toMatchObject({
      status: 500,
      message: expect.stringContaining("Failed to create item on Monday.com"),
    });
  });
});
