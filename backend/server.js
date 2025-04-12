import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongo } from "./db/mongo.js";

await connectMongo();
import ordersRoutes from "./routes/orders.js"; // ✅ импорт
import tokenRoutes from "./routes/token.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(ordersRoutes);     // ✅ обязательно подключить
app.use(tokenRoutes);
app.use(analyticsRoutes);

app.get("/", (req, res) => {
    res.send("Kaspi API Backend is Running 🚀");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
