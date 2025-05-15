import express from "express";
import boardRouter from "./routes/boardRoutes.js";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit'; 
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  message: {
    code: 429,
    message: "You have exceeded your five requests limit per minute !!!!!!!!!"
  }
});

app.use(limiter);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Board Routes API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/boardRoutes.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use("/api/v1/board", boardRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message || "Internal server error",
      details: err.details || undefined,
    },
  });
});

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("MongoDB conncted")).catch((err)=>console.error("MongoDB connection error:", err))

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

