import express from "express";
import axios from "axios";
import { getToken } from "../kaspi/tokenStore.js";

const router = express.Router();

router.get("/analytics", async (req, res) => {
    const token = getToken();
    if (!token) return res.status(403).json({ error: "API Token is missing" });

    const now = Date.now();
    const from = now - 14 * 24 * 60 * 60 * 1000; // последние 14 дней

    try {
        const url = `https://kaspi.kz/shop/api/v2/orders?page[number]=0&page[size]=100&filter[orders][creationDate][$ge]=${from}&filter[orders][creationDate][$le]=${now}`;
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

                    const entries = entriesRes.data.data.map(e => e.attributes);

                    return {
                        ...order,
                        attributes: {
                            ...order.attributes,
                            entries
                        }
                    };
                } catch (e) {
                    console.warn(`❗ Ошибка загрузки товаров для аналитики заказа ${order.id}`);
                    return order;
                }
            })
        );

        const productStats = {};
        const dailyStats = {};
        let totalRevenue = 0;

        for (const order of enrichedOrders) {
            const a = order.attributes;
            const day = new Date(a.creationDate).toISOString().split("T")[0];
            dailyStats[day] = (dailyStats[day] || 0) + 1;
            totalRevenue += a.totalPrice || 0;

            for (const item of a.entries || []) {
                const name = item.offer?.name || "Без названия";
                const qty = item.quantity;
                const rev = item.basePrice * qty;

                if (!productStats[name]) productStats[name] = { quantity: 0, revenue: 0 };

                productStats[name].quantity += qty;
                productStats[name].revenue += rev;
            }
        }

        const bestSellers = Object.entries(productStats)
            .filter(([_, stats]) => stats.quantity >= 3)
            .sort((a, b) => b[1].quantity - a[1].quantity)
            .slice(0, 5)
            .map(([name, stats]) => ({ name, ...stats }));

        const recommendations = Object.entries(productStats).map(([name, stats]) => ({
            name,
            quantitySold: stats.quantity,
            revenue: stats.revenue,
            recommendation:
                stats.quantity >= 3 ? "📦 Популярен — стоит закупить ещё" :
                    stats.quantity <= 1 ? "🛑 Мало продается" :
                        "🤏 Продается редко"
        }));

        res.json({
            dailyStats,
            productStats,
            recommendations,
            totalRevenue,
            bestSellers
        });

    } catch (e) {
        console.error("❌ Ошибка при генерации аналитики:", e.message);
        res.status(500).json({ error: "Failed to generate analytics" });
    }
});

export default router;



// import express from "express";
// import OrderModel from "../models/OrderModel.js";
//
// const router = express.Router();
//
// router.get("/analytics", async (req, res) => {
//     try {
//         const now = Date.now();
//         const from = now - 30 * 24 * 60 * 60 * 1000; // 30 дней
//
//         const orders = await OrderModel.find({
//             "attributes.creationDate": { $gte: from, $lte: now }
//         });
//
//         const productStats = {};
//         const dailyStats = {};
//         let totalRevenue = 0;
//
//         for (const order of orders) {
//             const a = order.attributes;
//             const day = new Date(a.creationDate).toISOString().split("T")[0];
//             dailyStats[day] = (dailyStats[day] || 0) + 1;
//             totalRevenue += a.totalPrice || 0;
//
//             for (const item of a.entries || []) {
//                 const name = item.name || "Без названия";
//                 const qty = item.quantity || 0;
//                 const price = item.price || 0;
//
//                 if (!productStats[name]) productStats[name] = { quantity: 0, revenue: 0 };
//                 productStats[name].quantity += qty;
//                 productStats[name].revenue += qty * price;
//             }
//         }
//
//         const recommendations = Object.entries(productStats).map(([name, stats]) => ({
//             name,
//             quantitySold: stats.quantity,
//             revenue: stats.revenue,
//             recommendation:
//                 stats.quantity >= 3 ? "📦 Популярен — стоит закупить ещё" :
//                     stats.quantity === 0 ? "🛑 Не продается — исключить?" :
//                         "🤏 Продается редко"
//         }));
//
//         const bestSellers = Object.entries(productStats)
//             .filter(([_, stats]) => stats.quantity >= 3)
//             .sort((a, b) => b[1].quantity - a[1].quantity)
//             .slice(0, 5)
//             .map(([name, stats]) => ({
//                 name,
//                 ...stats
//             }));
//
//         res.json({
//             dailyStats,
//             productStats,
//             recommendations,
//             totalRevenue,
//             bestSellers
//         });
//
//     } catch (e) {
//         console.error("❌ Ошибка при генерации аналитики из MongoDB:", e.message);
//         res.status(500).json({ error: "Failed to generate analytics from MongoDB" });
//     }
// });
//
// export default router;
