import { useState, useRef, useEffect } from "react";
import useTechnologiesApi from "../hooks/useTechnologiesApi";
import RoadmapImporter from "../components/RoadmapImporter";

function Api() {
    const { technologies, loading, error, refetch, loadExtraResources } =
        useTechnologiesApi();

    const [searchTerm, setSearchTerm] = useState("");
    const [debounced, setDebounced] = useState("");
    const searchTimeoutRef = useRef(null);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            setDebounced(value);
        }, 500);
    };

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const filteredTechnologies = technologies.filter(
        (tech) =>
            tech.title.toLowerCase().includes(debounced.toLowerCase()) ||
            tech.description.toLowerCase().includes(debounced.toLowerCase())
    );

    const handleLoadExtra = async (id) => {
        try {
            await loadExtraResources(id);
            alert("Дополнительные ресурсы загружены (см. карточку).");
        } catch {
            alert("Не удалось загрузить дополнительные ресурсы.");
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>API: дорожные карты и технологии</h1>
                <button className="btn" onClick={refetch}>
                    Обновить данные
                </button>
            </div>

            <RoadmapImporter />

            {loading && <p>Загрузка технологий из API...</p>}
            {error && (
                <p style={{ color: "red" }}>Ошибка загрузки технологий: {error}</p>
            )}

            {!loading && !error && (
                <>
                    <div className="search-box" style={{ marginTop: 10 }}>
                        <input
                            type="text"
                            placeholder="Поиск технологий (debounce 500ms)..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <span>Найдено: {filteredTechnologies.length}</span>
                    </div>

                    <div className="api-tech-grid">
                        {filteredTechnologies.map((tech) => (
                            <div key={tech.id} className="api-tech-card">
                                <h3>{tech.title}</h3>
                                <p>{tech.description}</p>

                                <p>
                                    <strong>Категория:</strong> {tech.category}
                                </p>
                                <p>
                                    <strong>Сложность:</strong> {tech.difficulty}
                                </p>

                                <div>
                                    <strong>Базовые ресурсы:</strong>
                                    <ul>
                                        {tech.resources?.map((r) => (
                                            <li key={r}>
                                                <a href={r} target="_blank" rel="noreferrer">
                                                    {r}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {tech.extraResources && tech.extraResources.length > 0 && (
                                    <div className="extra-resources">
                                        <strong>Доп. ресурсы (из API):</strong>
                                        <ul>
                                            {tech.extraResources.map((r, idx) => (
                                                <li key={idx}>{r}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => handleLoadExtra(tech.id)}
                                >
                                    Загрузить дополнительные ресурсы
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default Api;
