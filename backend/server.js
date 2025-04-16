import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongo } from "./db/mongo.js";

await connectMongo();
import ordersRoutes from "./routes/orders.js";
import tokenRoutes from "./routes/token.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();

const app = express();
const PORT = 3000;

// ✅ Правильная настройка CORS
app.use(cors({
    origin: ["http://localhost:5173", "https://kaspi-manager-1.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());

// ✅ Правильное подключение маршрутов с базовыми путями
app.use("/orders", ordersRoutes);
app.use("/", tokenRoutes); // оставим set-token без префикса
app.use("/analytics", analyticsRoutes);

app.get("/", (req, res) => {
    res.send("Kaspi API Backend is Running 🚀");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
