import { useState } from "react";
import axios from "axios";

export default function AddApiKey() {
    const [token, setToken] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/set-token", { token });
            setMessage(response.data.message);
            setToken("");
        } catch (error) {
            setMessage("Failed to save API Token");
        }
    };

    return (
        <div className="card">
            <h2>🔑 Enter Your Kaspi API Token</h2>
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
                <button type="submit" className="btn">Save Token</button>
            </form>
        </div>
    );
}
