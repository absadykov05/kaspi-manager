import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("kaspiToken");

    const [orders, setOrders] = useState([]);
    const [newOrders, setNewOrders] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [daysRange, setDaysRange] = useState(7);

    // ⛔️ Перенаправление на ввод токена
    useEffect(() => {
        if (!token) {
            navigate("/add-key");
        }
    }, [token, navigate]);

    // Загрузка данных
    useEffect(() => {
        if (token) {
            axios.post("http://localhost:3000/set-token", { token });
            fetchOrders(daysRange);
            fetchNewOrders();
            fetchAnalytics();
        }
    }, [token, daysRange]);

    const fetchOrders = async (days) => {
        const res = await axios.get(`http://localhost:3000/orders?days=${days}`);
        setOrders(res.data.data || []);
    };

    const fetchNewOrders = async () => {
        const res = await axios.get("http://localhost:3000/orders/new");
        setNewOrders(res.data.data || []);
    };

    const fetchAnalytics = async () => {
        const res = await axios.get("http://localhost:3000/analytics");
        setAnalytics(res.data);
    };

    const renderOrder = (order) => {
        const a = order.attributes;

        return (
            <li key={order.id} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "6px" }}>
                <strong>#{order.id}</strong> — {a.state}<br />
                💰 <strong>{a.totalPrice} ₸</strong><br />
                👤 {a.customer?.firstName} {a.customer?.lastName}<br />
                🛒 <strong>Товары:</strong>
                <ul>
                    {(a.entries || []).map((item, i) => (
                        <li key={i}>
                            {item.offer?.name || "Без названия"} — {item.quantity} × {item.basePrice} ₸
                        </li>
                    ))}
                </ul>
            </li>
        );
    };

    return (
        <div className="container">
            <h1>📊 Kaspi Manager Dashboard</h1>

            {/* Переключатель дней */}
            <div style={{ marginBottom: "1rem" }}>
                <button onClick={() => setDaysRange(7)}>7 дней</button>
                <button onClick={() => setDaysRange(14)} style={{ marginLeft: "1rem" }}>14 дней</button>
            </div>

            {/* Заказы */}
            <h2>📦 Заказы за {daysRange} дней</h2>
            <ul>{orders.map(renderOrder)}</ul>


            {/* Аналитика */}

            <h2>🌟 Хиты продаж</h2>
            {analytics?.bestSellers?.length > 0 ? (
                <ul>
                    {analytics.bestSellers.map((item, i) => (
                        <li key={i}>{item.name}: {item.quantity} шт — {item.revenue} ₸</li>
                    ))}
                </ul>
            ) : <p>Нет данных</p>}

            <h2>🧠 Рекомендации</h2>
            {analytics?.recommendations?.length > 0 ? (
                <ul>
                    {analytics.recommendations.map((r, i) => (
                        <li key={i}><strong>{r.name}</strong>: {r.recommendation}</li>
                    ))}
                </ul>
            ) : <p>Рекомендаций пока нет</p>}
        </div>
    );
}
