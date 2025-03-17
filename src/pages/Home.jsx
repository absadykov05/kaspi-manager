import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="card">
            <h1 className="text-center">Добро пожаловать в Kaspi Monitor</h1>
            <p className="text-muted text-center">Отслеживайте остатки, цены и тренды на Kaspi!</p>
            <div className="text-center">
                <Link to="/add-key" className="btn">Добавить API-ключ</Link>
            </div>
        </div>
    );
}
