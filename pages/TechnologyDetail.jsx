import { useParams, Link } from "react-router-dom";
import TechnologyNotes from "../components/TechnologyNotes";

function TechnologyDetail({ technologies, onUpdateStatus, onUpdateNotes }) {
    const { techId } = useParams();
    const id = Number(techId);

    const tech = technologies.find((t) => t.id === id);

    if (!tech) {
        return (
            <div className="page">
                <h1>Технология не найдена</h1>
                <p>Технология с ID {techId} отсутствует.</p>
                <Link to="/technologies" className="btn">
                    ← Назад к списку
                </Link>
            </div>
        );
    }

    const setStatus = (status) => {
        onUpdateStatus(id, status);
    };

    return (
        <div className="page">
            <div className="page-header">
                <Link to="/technologies" className="back-link">
                    ← Назад к списку
                </Link>
                <h1>{tech.title}</h1>
            </div>

            <div className="technology-detail">
                <div className="detail-section">
                    <h3>Описание</h3>
                    <p>{tech.description}</p>
                </div>

                <div className="detail-section">
                    <h3>Статус изучения</h3>
                    <div className="status-buttons">
                        <button
                            onClick={() => setStatus("not-started")}
                            className={
                                tech.status === "not-started" ? "active" : ""
                            }
                        >
                            Не начато
                        </button>
                        <button
                            onClick={() => setStatus("in-progress")}
                            className={
                                tech.status === "in-progress" ? "active" : ""
                            }
                        >
                            В процессе
                        </button>
                        <button
                            onClick={() => setStatus("completed")}
                            className={
                                tech.status === "completed" ? "active" : ""
                            }
                        >
                            Завершено
                        </button>
                    </div>
                </div>

                <div className="detail-section">
                    <h3>Мои заметки</h3>
                    <TechnologyNotes
                        techId={tech.id}
                        notes={tech.notes}
                        onNotesChange={onUpdateNotes}
                    />
                </div>
            </div>
        </div>
    );
}

export default TechnologyDetail;
