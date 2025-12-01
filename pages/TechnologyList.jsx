import { useState } from "react";
import { Link } from "react-router-dom";
import ProgressHeader from "../components/ProgressHeader";
import TechnologyCard from "../components/TechnologyCard";
import TechnologyNotes from "../components/TechnologyNotes";
import QuickActions from "../components/QuickActions";

function TechnologyList({
    technologies,
    cycleStatus,
    updateNotes,
    markAllCompleted,
    resetAll,
}) {
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = technologies.filter(
        (tech) =>
            tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tech.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="page">
            <div className="page-header">
                <h1>Все технологии</h1>
                <Link to="/add-technology" className="btn btn-primary">
                    + Добавить технологию
                </Link>
            </div>

            <ProgressHeader technologies={technologies} />

            <QuickActions
                technologies={technologies}
                markAllCompleted={markAllCompleted}
                resetAll={resetAll}
            />

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Поиск технологий..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span>Найдено: {filtered.length}</span>
            </div>

            {filtered.map((tech) => (
                <div key={tech.id}>
                    <TechnologyCard
                        tech={tech}
                        onStatusChange={() => cycleStatus(tech.id)}
                    />
                    <div style={{ marginTop: 4, marginBottom: 4 }}>
                        <Link
                            to={`/technology/${tech.id}`}
                            className="btn-link"
                        >
                            Подробнее →
                        </Link>
                    </div>
                    <TechnologyNotes
                        techId={tech.id}
                        notes={tech.notes}
                        onNotesChange={updateNotes}
                    />
                </div>
            ))}

            {filtered.length === 0 && (
                <p>Технологий не найдено. Попробуй изменить запрос.</p>
            )}
        </div>
    );
}

export default TechnologyList;
