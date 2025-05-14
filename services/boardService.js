export const generateBoard = async (payload) => {
  try {
    return { statusCode: 200, statusMessage: "Created successfully" };
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      data: {},
      message: "Validation error.",
      error: error.message,
    });
  }
};

export const getBoard = async (payload) => {
  try {
    const sampleData = {
      data: {
        boardId: 1,
        boardName: "My Board",
        items: [
          {
            id: 1,
            itemId: "123456789",
            itemName: "Deal 1",
            amount: 5000,
            status: "closedwon"
          },
          {
            id: 2,
            itemId: "987654321",
            itemName: "Deal 2",
            amount: 3000,
            status: "closedwon"
          }
        ]
      },
    }

    return { statusCode: 200, statusMessage: "Fetched successfully", data: sampleData };
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      data: {},
      message: "Validation error.",
      error: error.message,
    });
  }
};