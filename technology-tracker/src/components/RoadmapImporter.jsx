import { useState } from "react";
import useTechnologiesApi from "../hooks/useTechnologiesApi";
import "./RoadmapImporter.css";

function RoadmapImporter() {
    const { addTechnology } = useTechnologiesApi();
    const [importing, setImporting] = useState(false);
    const [url, setUrl] = useState("");

    const handleImportRoadmap = async (roadmapUrl) => {
        try {
            setImporting(true);

            const response = await fetch(roadmapUrl);
            if (!response.ok) {
                throw new Error("Не удалось загрузить дорожную карту");
            }

            const roadmapData = await response.json();

            for (const tech of roadmapData.technologies) {
                await addTechnology(tech);
            }

            alert(
                `Успешно импортировано ${roadmapData.technologies.length} технологий`
            );
        } catch (err) {
            alert(`Ошибка импорта: ${err.message}`);
        } finally {
            setImporting(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url.trim()) return;
        handleImportRoadmap(url.trim());
    };

    const handleExampleImport = () => {
        handleImportRoadmap("https://api.example.com/roadmaps/frontend");
    };

    return (
        <div className="roadmap-importer">
            <h3>Импорт дорожной карты</h3>

            <form onSubmit={handleSubmit} className="roadmap-form">
                <input
                    type="text"
                    placeholder="Вставьте URL JSON-дорожной карты"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={importing}
                />
                <button type="submit" disabled={importing}>
                    {importing ? "Импорт..." : "Импорт по URL"}
                </button>
            </form>

            <button
                type="button"
                onClick={handleExampleImport}
                disabled={importing}
                className="import-example-btn"
            >
                Импортировать пример дорожной карты
            </button>
        </div>
    );
}

export default RoadmapImporter;
