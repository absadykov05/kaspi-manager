import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;
console.log("📦 URI из .env:", uri);

export async function connectMongo() {
    try {
        await mongoose.connect(uri, {
            dbName: "test", // Убедись, что совпадает с названием базы
        });
        console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
    }
}
