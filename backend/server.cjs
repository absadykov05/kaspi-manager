require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

let kaspiToken = "";

// ✅ Save API Token from the frontend
app.post("/set-token", (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: "API Token is required" });
    }
    kaspiToken = token;
    res.json({ message: "API Token saved successfully!" });
});

// ✅ Fetch Store Information
app.get("/store-info", async (req, res) => {
    if (!kaspiToken) {
        return res.status(403).json({ error: "API Token is missing" });
    }

    console.log("Using API Token:", kaspiToken); // Логируем токен, чтобы убедиться, что он передаётся

    try {
        const response = await axios.get("https://kaspi.kz/shop/api/v2/store", {
            headers: { "X-Auth-Token": kaspiToken },
        });

        console.log("Kaspi API Response:", response.data); // Логируем ответ API
        res.json(response.data);
    } catch (error) {
        console.error("Kaspi API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch store info" });
    }
});


// ✅ Fetch Products List
app.get("/products", async (req, res) => {
    if (!kaspiToken) {
        return res.status(403).json({ error: "API Token is missing" });
    }

    try {
        const response = await axios.get("https://kaspi.kz/shop/api/v2/products", {
            headers: { "X-Auth-Token": kaspiToken },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// ✅ Fetch Orders
app.get("/orders", async (req, res) => {
    if (!kaspiToken) {
        return res.status(403).json({ error: "API Token is missing" });
    }

    try {
        const response = await axios.get("https://kaspi.kz/shop/api/v2/orders", {
            headers: { "X-Auth-Token": kaspiToken },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Kaspi API Backend is Running 🚀");
});
