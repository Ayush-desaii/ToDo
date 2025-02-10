import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";

import userRoute from "./routes/authRoutes";
import todoRoute from "./routes/todo";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => { 
    res.send("Hello World");
});

app.use("/auth", userRoute);
app.use("/todos", todoRoute);

AppDataSource.initialize()
    .then(() => {
        console.log("📌 Database Connected Successfully");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.error("❌ Database Connection Failed:", error));
