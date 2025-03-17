import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
    const [storeInfo, setStoreInfo] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchStoreInfo();
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchStoreInfo = async () => {
        try {
            const response = await axios.get("http://localhost:3000/store-info");
            setStoreInfo(response.data);
        } catch (error) {
            console.error("Error fetching store info:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:3000/orders");
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    return (
        <div className="container">
            <h1 className="text-center">📊 Store Dashboard</h1>

            {/* Store Info */}
            {storeInfo ? (
                <div className="card">
                    <h2>🏪 Store: {storeInfo.name}</h2>
                    <p>📦 Total Products: {storeInfo.productCount}</p>
                    <p>💰 Total Sales: {storeInfo.salesTotal} ₸</p>
                </div>
            ) : (
                <p>Loading store info...</p>
            )}

            {/* Product List */}
            <h2>🛒 Products</h2>
            <div className="product-list">
                {products.length > 0 ? (
                    <ul>
                        {products.map((product) => (
                            <li key={product.id}>
                                {product.name} - {product.price} ₸ (Stock: {product.stock})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No products found.</p>
                )}
            </div>

            {/* Order List */}
            <h2>📦 Orders</h2>
            <div className="order-list">
                {orders.length > 0 ? (
                    <ul>
                        {orders.map((order) => (
                            <li key={order.id}>
                                Order #{order.id} - {order.status} - {order.total} ₸
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </div>
    );
}
