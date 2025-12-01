import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

function Navigation() {
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path ||
        (path !== "/" && location.pathname.startsWith(path));

    return (
        <nav className="main-navigation">
            <div className="nav-brand">
                <Link to="/">
                    <h2>🚀 Трекер технологий</h2>
                </Link>
            </div>

            <ul className="nav-menu">
                <li>
                    <Link
                        to="/"
                        className={isActive("/") ? "active" : ""}
                    >
                        Главная
                    </Link>
                </li>
                <li>
                    <Link
                        to="/technologies"
                        className={isActive("/technologies") ? "active" : ""}
                    >
                        Технологии
                    </Link>
                </li>
                <li>
                    <Link
                        to="/stats"
                        className={isActive("/stats") ? "active" : ""}
                    >
                        Статистика
                    </Link>
                </li>
                <li>
                    <Link
                        to="/settings"
                        className={isActive("/settings") ? "active" : ""}
                    >
                        Настройки
                    </Link>
                </li>
                <li>
                    <Link
                        to="/api"
                        className={isActive("/api") ? "active" : ""}
                    >
                        API
                    </Link>
                </li>
                <li>
                    <Link
                        to="/ui-kit"
                        className={isActive("/ui-kit") ? "active" : ""}
                    >
                        UI-кит
                    </Link>
                </li>
                <li>
                    <Link
                        to="/add-technology"
                        className={isActive("/add-technology") ? "active" : ""}
                    >
                        Менеджер
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;
