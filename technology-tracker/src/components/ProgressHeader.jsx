import "./ProgressHeader.css";

function ProgressHeader({ technologies }) {
    const total = technologies.length;
    const completed = technologies.filter(t => t.status === "completed").length;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className="progress-header">
            <h2>Прогресс изучения</h2>

            <p>Всего тем: {total}</p>
            <p>Изучено: {completed}</p>

            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${percent}%` }}></div>
            </div>

            <p>{percent}% выполнено</p>
        </div>
    );
}

export default ProgressHeader;
