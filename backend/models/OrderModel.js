// models/OrderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true },
    totalPrice: Number,
    entries: Array,
    createdAt: Date,
});

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
