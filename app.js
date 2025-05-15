import express from "express";
import boardRouter from "./routes/boardRoutes.js";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const app = express();

app.use(express.json());

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Board Routes API',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:8000'
            }
        ]
    },
    apis: ['./routes/boardRoutes.js'] 
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use("/api/v1/board", boardRouter);

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
