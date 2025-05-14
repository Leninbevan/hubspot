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
