import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId: String,
    creationDate: Number,
    totalPrice: Number,
    state: String,
    entries: [
        {
            name: String,
            quantity: Number,
            price: Number,
        },
    ],
});

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
