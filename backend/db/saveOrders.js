import OrderModel from "../models/OrderModel.js";

export async function saveOrdersToDB(orders) {
    try {
        let saved = 0;

        for (const order of orders) {
            const exists = await OrderModel.findOne({ orderId: order.id });
            if (!exists) {
                const newOrder = new OrderModel({
                    orderId: order.id,
                    totalPrice: order.attributes.totalPrice,
                    entries: order.attributes.entries || [],
                    createdAt: new Date(order.attributes.creationDate),
                });
                await newOrder.save();
                saved++;
            }
        }

        console.log(`💾 Сохранено ${saved} новых заказов в MongoDB`);
    } catch (e) {
        console.error("❌ Ошибка при сохранении заказов:", e.message);
    }
}
