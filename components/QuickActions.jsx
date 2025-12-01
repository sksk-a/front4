import { useState } from "react";
import Modal from "./Modal";
import "./QuickActions.css";

function QuickActions({ technologies, markAllCompleted, resetAll }) {
    const [isOpen, setIsOpen] = useState(false);
    const [exportData, setExportData] = useState("");

    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            technologies,
        };

        setExportData(JSON.stringify(data, null, 2));
        setIsOpen(true);
    };

    return (
        <div className="quick-actions">
            <h3 className="qa-title">Быстрые действия</h3>

            <div className="qa-buttons">
                <button
                    className="qa-btn qa-complete"
                    onClick={markAllCompleted}
                >
                    ✔ Отметить всё
                </button>

                <button className="qa-btn qa-reset" onClick={resetAll}>
                    ↺ Сбросить статусы
                </button>

                <button className="qa-btn qa-export" onClick={handleExport}>
                    📤 Экспорт JSON
                </button>
            </div>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Экспорт данных"
            >
                <p>JSON-файл:</p>
                <pre className="qa-export-pre">{exportData}</pre>
                <button
                    className="qa-btn qa-close"
                    onClick={() => setIsOpen(false)}
                >
                    Закрыть
                </button>
            </Modal>
        </div>
    );
}

export default QuickActions;
