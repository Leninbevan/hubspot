import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { generateBoard } from "../services/boardService.js";

describe("generateBoard", () => {
  let mockAxios;

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
    process.env.API_URL = "https://fake.api/graphql";
    process.env.API_TOKEN = "fake-token";
  });

  afterEach(() => {
    mockAxios.reset();
  });

  afterAll(() => {
    mockAxios.restore();
  });

  const validPayload = {
    dealName: "Deal 1",
    propertyValue: "closedwon",
    dealAmount: "10000",
    contactEmail: "test@example.com",
    objectType: "deal",
    objectId: "123",
    propertyName: "status",
    eventType: "update",
  };

  it("should create an item successfully", async () => {
    const fakeResponse = {
      data: {
        create_item: {
          id: "456",
        },
      },
    };

    mockAxios.onPost(process.env.API_URL).reply(200, fakeResponse);

    const result = await generateBoard(validPayload);

    expect(result).toEqual({
      statusCode: 200,
      statusMessage: "Item created successfully",
      itemId: "456",
    });

    const request = mockAxios.history.post[0];
    expect(request.headers.Authorization).toBe(`Bearer ${process.env.API_TOKEN}`);
    expect(request.headers["Content-Type"]).toBe("application/json");
  });

  it("should throw validation error if required fields are missing", async () => {
    const invalidPayload = {
      dealName: "",
      propertyValue: null,
      dealAmount: undefined,
      contactEmail: "",
      objectType: "",
      objectId: "",
      propertyName: "",
      eventType: "",
    };

    await expect(generateBoard(invalidPayload)).rejects.toMatchObject({
      message: "Missing required fields",
      status: 400,
      details: expect.arrayContaining([
        expect.objectContaining({ loc: ["body", "dealName"] }),
        expect.objectContaining({ loc: ["body", "propertyValue"] }),
        expect.objectContaining({ loc: ["body", "dealAmount"] }),
        expect.objectContaining({ loc: ["body", "contactEmail"] }),
        expect.objectContaining({ loc: ["body", "objectType"] }),
        expect.objectContaining({ loc: ["body", "objectId"] }),
        expect.objectContaining({ loc: ["body", "propertyName"] }),
        expect.objectContaining({ loc: ["body", "eventType"] }),
      ]),
    });
  });

  it("should throw error if axios call fails", async () => {
    mockAxios.onPost(process.env.API_URL).networkError();

    await expect(generateBoard(validPayload)).rejects.toMatchObject({
      message: expect.stringContaining("Failed to create item on Monday.com"),
      status: 500,
    });
  });
});
