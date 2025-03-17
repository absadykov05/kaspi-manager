import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/">Kaspi Monitor</Link>
                <div className="navbar-nav">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                    <Link className="nav-link" to="/add-key">Добавить API-ключ</Link>
                </div>
            </div>
        </nav>
    );
}
