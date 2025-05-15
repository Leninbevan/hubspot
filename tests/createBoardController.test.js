import express from "express";
import request from "supertest";
import { createBoard } from "../controllers/boardControllers.js";
import * as boardService from "../services/boardService.js";

const app = express();
app.use(express.json());

app.post("/api/v1/board/create", createBoard);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        details: err.details || null,
    });
});

describe("POST /api/v1/board/create", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should return 200 and item info when board creation succeeds", async () => {
        const fakeResult = {
            statusCode: 200,
            statusMessage: "Item created successfully",
            itemId: "789",
        };

        jest.spyOn(boardService, "generateBoard").mockResolvedValue(fakeResult);

        const response = await request(app)
            .post("/api/v1/board/create")
            .send({
                dealName: "Test Deal",
                propertyValue: "closedwon",
                dealAmount: "2000",
                contactEmail: "test@example.com",
                objectType: "deal",
                objectId: "123",
                propertyName: "stage",
                eventType: "update",
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(fakeResult);
    });

    it("should return 400 if required fields are missing", async () => {
        const error = new Error("Missing required fields");
        error.status = 400;
        error.details = [
            {
                type: "missing",
                loc: ["body", "dealName"],
                msg: "Field required",
            },
        ];

        jest.spyOn(boardService, "generateBoard").mockRejectedValue(error);

        const response = await request(app)
            .post("/api/v1/board/create")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Missing required fields");
        expect(response.body.details).toEqual(error.details);
    });

    it("should return 500 if board creation fails unexpectedly", async () => {
        const error = new Error("Internal Server Error");
        error.status = 500;

        jest.spyOn(boardService, "generateBoard").mockRejectedValue(error);

        const response = await request(app)
            .post("/api/v1/board/create")
            .send({
                dealName: "Test Deal",
                propertyValue: "open",
                dealAmount: "1000",
                contactEmail: "test@example.com",
                objectType: "deal",
                objectId: "321",
                propertyName: "stage",
                eventType: "create",
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Internal Server Error");
    });
});
