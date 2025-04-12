import express from "express";
import axios from "axios";
import { getToken } from "../kaspi/tokenStore.js";
import { saveOrdersToDB } from "../db/saveOrders.js";

const router = express.Router();

// 🔁 Заказы за N дней
router.get("/orders", async (req, res) => {
    const token = getToken();
    if (!token) return res.status(403).json({ error: "API Token is missing" });

    const now = Date.now();
    const from = now - 14 * 24 * 60 * 60 * 1000;

    try {
        const url = `https://kaspi.kz/shop/api/v2/orders?page[number]=0&page[size]=20&filter[orders][creationDate][$ge]=${from}&filter[orders][creationDate][$le]=${now}`;
        const ordersRes = await axios.get(url, {
            headers: { "X-Auth-Token": token }
        });

        const orders = ordersRes.data.data;

        const enrichedOrders = await Promise.all(
            orders.map(async (order) => {
                const entriesUrl = order.relationships?.entries?.links?.related;
                try {
                    const entriesRes = await axios.get(entriesUrl, {
                        headers: { "X-Auth-Token": token }
                    });

                    const entries = entriesRes.data.data.map(e => e.attributes); // ✅ получаем name, price, quantity

                    return {
                        ...order,
                        attributes: {
                            ...order.attributes,
                            entries
                        }
                    };
                } catch (e) {
                    console.warn(`❗ Ошибка загрузки товаров для заказа ${order.id}`);
                    return order;
                }
            })
        );

        res.json({ data: enrichedOrders });
    } catch (e) {
        console.error("❌ Ошибка при получении заказов:", e.message);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});


// 🔁 Только новые заказы
router.get("/orders/new", async (req, res) => {
    const token = getToken();
    if (!token) return res.status(403).json({ error: "API Token is missing" });

    const now = Date.now();
    const from = now - 7 * 24 * 60 * 60 * 1000;

    try {
        const url = `https://kaspi.kz/shop/api/v2/orders?page[number]=0&page[size]=100&filter[orders][state]=NEW&filter[orders][creationDate][$ge]=${from}&filter[orders][creationDate][$le]=${now}`;
        const ordersRes = await axios.get(url, {
            headers: { "X-Auth-Token": token }
        });

        const orders = ordersRes.data.data;

        const enrichedOrders = await Promise.all(
            orders.map(async (order) => {
                const entriesUrl = order.relationships?.entries?.links?.related;
                try {
                    const entriesRes = await axios.get(entriesUrl, {
                        headers: { "X-Auth-Token": token }
                    });

                    const entries = entriesRes.data.data.map(e => e.attributes); // ✅

                    return {
                        ...order,
                        attributes: {
                            ...order.attributes,
                            entries
                        }
                    };
                } catch (e) {
                    console.warn(`❗ Ошибка загрузки товаров для заказа ${order.id}`);
                    return order;
                }
            })
        );

// 💾 Сохраняем заказы в MongoDB
        await saveOrdersToDB(enrichedOrders);

// 📤 Только потом отправляем клиенту
        res.json({ data: enrichedOrders });

    } catch (e) {
        console.error("❌ Ошибка при получении новых заказов:", e.message);
        res.status(500).json({ error: "Failed to fetch new orders" });
    }
});

export default router;
