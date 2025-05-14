import express from "express";
import boardRouter from "./routes/boardRoutes.js";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});


// API versioning
app.use("/api/v1/board",boardRouter )

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});