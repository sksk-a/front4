function Stats({ technologies, progress }) {
    const total = technologies.length;
    const completed = technologies.filter(t => t.status === "completed").length;
    const inProgress = technologies.filter(t => t.status === "in-progress").length;
    const notStarted = technologies.filter(t => t.status === "not-started").length;

    const percent = (value) =>
        total === 0 ? 0 : Math.round((value / total) * 100);

    return (
        <div className="page">
            <h1>Статистика прогресса</h1>

            <p>Всего технологий: <strong>{total}</strong></p>

            <div style={{ margin: "16px 0" }}>
                <h3>Общий прогресс</h3>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p>{progress}% завершено</p>
            </div>

            <div className="stats-grid">
                <div className="stats-card">
                    <h4>Не начато</h4>
                    <p>{notStarted} шт.</p>
                    <div className="mini-bar">
                        <div
                            style={{ width: `${percent(notStarted)}%` }}
                        />
                    </div>
                    <span>{percent(notStarted)}%</span>
                </div>

                <div className="stats-card">
                    <h4>В процессе</h4>
                    <p>{inProgress} шт.</p>
                    <div className="mini-bar">
                        <div
                            style={{ width: `${percent(inProgress)}%` }}
                        />
                    </div>
                    <span>{percent(inProgress)}%</span>
                </div>

                <div className="stats-card">
                    <h4>Завершено</h4>
                    <p>{completed} шт.</p>
                    <div className="mini-bar">
                        <div
                            style={{ width: `${percent(completed)}%` }}
                        />
                    </div>
                    <span>{percent(completed)}%</span>
                </div>
            </div>
        </div>
    );
}

export default Stats;