import axios from "axios";

export const generateBoard = async (webhookPayload) => {
  const {
    dealName,
    propertyValue: dealStage,
    dealAmount,
    contactEmail,
  } = webhookPayload;
  const boardId = 2012772463;
  const API_URL = "https://api.monday.com/v2";
  const API_TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjUxMjYwMTc2OCwiYWFpIjoxMSwidWlkIjo3NTk4NzQxNiwiaWFkIjoiMjAyNS0wNS0xNFQwODoxODozMS40ODZaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6Mjk0OTk3MTQsInJnbiI6ImFwc2UyIn0.HetuZhl4nrQWNCJp2RaJ1MBawlOQppz82z8efbWrIEQ";
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
    const response = await axios.post(API_URL, mutationQuery, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
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

export const getBoard = async (payload) => {
  try {
    const sampleData = {
      eventId: "123456",
      eventType: "deal.propertyChange",
      propertyName: "dealstage",
      objectId: "56789",
      objectType: "DEAL",
      propertyValue: "closedwon",
      dealName: "Acme Corp Implementation",
      dealAmount: "25000",
      contactEmail: "john.doe@acme.com",
    };

    return {
      statusCode: 200,
      statusMessage: "Fetched successfully",
      data: sampleData,
    };
  } catch (error) {
    return {
      statusCode: 400,
      data: {},
      message: "Validation error.",
      error: error.message,
    };
  }
};
