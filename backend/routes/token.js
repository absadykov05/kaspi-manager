import express from "express";
import { setToken } from "../kaspi/tokenStore.js";

const router = express.Router();

router.post("/set-token", (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "API Token is required" });

    setToken(token);
    console.log("✅ Token set");
    res.json({ message: "Token saved successfully" });
});

export default router;
