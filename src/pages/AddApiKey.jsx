import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddApiKey() {
    const [token, setToken] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/set-token", { token });
            setMessage(response.data.message);
            localStorage.setItem("kaspiToken", token); // Сохраняем токен
            navigate("/dashboard"); // Переход в Dashboard
        } catch (error) {
            setMessage("❌ Failed to save API Token");
        }
    };

    return (
        <div className="card">
            <h2>🔑 Введите ваш Kaspi API Token</h2>
            {message && <p className="text-success">{message}</p>}
            <form onSubmit={handleSubmit}>
                <label className="form-label">API Token:</label>
                <input
                    type="text"
                    className="form-control"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                />
                <button type="submit" className="btn">Сохранить</button>
            </form>
        </div>
    );
}

