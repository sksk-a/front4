function Settings({ onResetStatuses, onMarkAllCompleted, onResetToDefaults }) {
    const handleResetAll = () => {
        if (window.confirm("Сбросить все статусы на 'Не начато'?")) {
            onResetStatuses();
        }
    };

    const handleMarkAll = () => {
        if (window.confirm("Отметить все технологии как завершённые?")) {
            onMarkAllCompleted();
        }
    };

    const handleResetDefaults = () => {
        if (
            window.confirm(
                "Вернуть список технологий к начальному состоянию? Текущие данные пропадут."
            )
        ) {
            onResetToDefaults();
        }
    };

    return (
        <div className="page">
            <h1>Настройки трекера</h1>

            <div className="settings-section">
                <h3>Управление прогрессом</h3>
                <div className="settings-actions">
                    <button className="btn" onClick={handleResetAll}>
                        ↺ Сбросить все статусы
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleMarkAll}
                    >
                        ✓ Отметить всё как завершённое
                    </button>
                </div>
            </div>

            <div className="settings-section">
                <h3>Данные приложения</h3>
                <p style={{ fontSize: 14, color: "#666" }}>
                    Можно вернуть список технологий к исходному
                    состоянию из методички.
                </p>
                <button
                    className="btn btn-danger"
                    onClick={handleResetDefaults}
                >
                    🗑 Полный сброс к начальным данным
                </button>
            </div>
        </div>
    );
}

export default Settings;
