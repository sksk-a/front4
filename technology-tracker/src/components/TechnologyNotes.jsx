import "./TechnologyNotes.css";

function TechnologyNotes({ notes, onNotesChange, techId }) {
    const handleChange = (e) => {
        onNotesChange(techId, e.target.value);
    };

    return (
        <div className="notes-section">
            <h4>Мои заметки:</h4>

            <textarea
                value={notes}
                onChange={handleChange}
                placeholder="Записывайте сюда важные моменты..."
                rows="3"
            />

            <div className="notes-hint">
                {notes && notes.length > 0
                    ? `Заметка сохранена (${notes.length} символов)`
                    : "Добавьте заметку"}
            </div>
        </div>
    );
}

export default TechnologyNotes;
