import axios from "axios";

export const generateBoard = async (webhookPayload) => {
  const {
    dealName,
    propertyValue: dealStage,
    dealAmount,
    contactEmail,
  } = webhookPayload;
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
    return {
      statusCode: 500,
      message: "Failed to create item on Monday.com",
      error: error.message,
    };
  }
};
