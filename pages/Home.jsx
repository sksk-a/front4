import { Link } from "react-router-dom";

function Home({ progress, total }) {
    return (
        <div className="page">
            <h1>Трекер изучения технологий</h1>

            <div style={{ marginTop: 20, marginBottom: 20 }}>
                <p>
                    Всего технологий: <strong>{total}</strong>
                </p>
                <p>
                    Общий прогресс: <strong>{progress}%</strong>
                </p>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
                <Link to="/technologies" className="btn btn-primary">
                    Перейти к списку технологий
                </Link>
                <Link to="/add-technology" className="btn">
                    Добавить новую технологию
                </Link>
            </div>
        </div>
    );
}

export default Home;
