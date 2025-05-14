import axios from 'axios';

export const generateBoard = async (payload) => {
  const sampleJSON = {
    data: {
      boardId: 2013655268,
      boardName: 'My test1',
      items: [
        {
          id: 1,
          dealId: '123456789',
          dealName: 'Deal 1',
          amount: 5000,
          status: 'closedwon'
        },
        {
          id: 2,
          dealId: '987654321',
          dealName: 'Deal 2',
          amount: 3000,
          status: 'closedwon'
        }
      ]
    }
  };

  const boardId = sampleJSON.data.boardId;
  const boardName = sampleJSON.data.boardName;
  const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjUxMjYwMTc2OCwiYWFpIjoxMSwidWlkIjo3NTk4NzQxNiwiaWFkIjoiMjAyNS0wNS0xNFQwODoxODozMS40ODZaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6Mjk0OTk3MTQsInJnbiI6ImFwc2UyIn0.HetuZhl4nrQWNCJp2RaJ1MBawlOQppz82z8efbWrIEQ'; // replace with your actual API key
  const BASE_URL = 'https://api.monday.com/v2';

  try {
    // Step 1: Read the board
    const readQuery = {
      query: `query {
        boards (ids: ${boardId}) {
          id
          name
          columns {
            id
            title
          }
        }
      }`
    };

    const readResponse = await axios.post(BASE_URL, readQuery, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_KEY
      }
    });
    const boards = readResponse.data?.data?.boards || [];
    if (boards.length === 0) {
      // ✅ Board not found — create a new board
      const createBoardQuery = {
        query: `mutation {
          create_board(
            board_name: "${boardName}",
            board_kind: public
          ) {
            id
          }
        }`
      };
      const createBoardRes = await axios.post(BASE_URL, createBoardQuery, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: API_KEY
        }
      });
    } else {
      // ✅ Board exists — compare name
      const existingBoardName = boards[0].name;
      if (existingBoardName !== boardName) {
        const updateBoardQuery = {
          query: `mutation {
            update_board(
              board_id: ${boardId},
              board_attribute: name,
              new_value: "${boardName}"
            )
          }`
        };

        await axios.post(BASE_URL, updateBoardQuery, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: API_KEY
          }
        });
      }
    }

    return { statusCode: 200, statusMessage: 'Created or updated successfully' };
  } catch (error) {
    return {
      statusCode: 400,
      data: {},
      message: 'Validation error.',
      error: error.message
    };
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