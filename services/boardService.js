import axios from "axios";
import boardItemModal from "../modals/boardItemsModal.js";

export const generateBoard = async (webhookPayload) => {
  const existingEventId = await boardItemModal.findOne({ eventId: webhookPayload.eventId })
  if (existingEventId) {
    const error = new Error('Board Item already available with this Event Id.');
    error.status = 403;
    throw error;
  } else {
    const newBoardItem = await new boardItemModal(webhookPayload);
    await newBoardItem.save();
    const {
      dealName,
      propertyValue: dealStage,
      dealAmount,
      contactEmail,
      objectType,
      objectId,
      propertyName,
      eventType,
    } = webhookPayload;

    const requiredFields = {
      dealName,
      propertyValue: dealStage,
      dealAmount,
      contactEmail,
      // objectType,
      // objectId,
      // propertyName,
      // eventType,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      const error = new Error("Missing required fields");
      error.status = 400;
      error.details = missingFields.map((field) => ({
        type: "missing",
        loc: ["body", field],
        msg: "Field required",
      }));
      throw error;
    }

    const boardId = 2012772463;
    const columnValues = {
      status: { label: dealStage === "closedwon" ? "Closed Won" : "Open" },
      numbers: parseFloat(dealAmount),
      email: {
        email: contactEmail,
        text: contactEmail,
      },
    };

    const mutationQuery = {
      query: `mutation {
      create_item(
        board_id: ${boardId},
        item_name: "${dealName}",
        column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}"
        ) {
          id
          }
          }`,
    };

    try {
      const response = await axios.post(process.env.API_URL, mutationQuery, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      });

      const createdItemId = response.data?.data?.create_item?.id;
      return {
        statusCode: 200,
        statusMessage: "Item created successfully",
        itemId: createdItemId,
      };
    } catch (error) {
      const err = new Error("Failed to create item on Monday.com: " + error.message);
      err.status = 500;
      throw err;
    }
  }
};

