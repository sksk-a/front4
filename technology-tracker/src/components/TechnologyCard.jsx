import "./TechnologyCard.css";

function TechnologyCard({ tech, onStatusChange }) {
    const { title, description, status } = tech;

    const getStatusColor = () => {
        switch (status) {
            case "completed":
                return "status-completed";
            case "in-progress":
                return "status-progress";
            default:
                return "status-not-started";
        }
    };

    return (
        <div
            className={`tech-card ${getStatusColor()}`}
            onClick={() => onStatusChange(tech.id)}
        >
            <h3>{title}</h3>
            <p>{description}</p>

            <div className="status">
                {status === "completed" && "✅ Завершено"}
                {status === "in-progress" && "⏳ В процессе"}
                {status === "not-started" && "🔒 Не начато"}
            </div>
        </div>
    );
}

export default TechnologyCard;
