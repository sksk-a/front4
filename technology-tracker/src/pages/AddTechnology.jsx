import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function validateForm(values) {
    const errors = {};

    if (!values.title.trim()) {
        errors.title = "Название обязательно";
    } else if (values.title.trim().length < 3) {
        errors.title = "Минимум 3 символа";
    }

    if (!values.category) {
        errors.category = "Выберите категорию";
    }

    if (!values.difficulty) {
        errors.difficulty = "Выберите уровень";
    }

    if (values.deadline) {
        const d = Date.parse(values.deadline);
        if (Number.isNaN(d)) {
            errors.deadline = "Некорректная дата";
        }
    }

    const resourceErrors = [];
    values.resources.forEach((res, index) => {
        const trimmed = res.trim();
        if (trimmed.length === 0) return;
        if (!/^https?:\/\//i.test(trimmed)) {
            resourceErrors[index] = "Ссылка должна начинаться с http или https";
        }
    });

    if (resourceErrors.length > 0) {
        errors.resources = resourceErrors;
    }

    return errors;
}

function AddTechnology({
    onAdd,
    technologies,
    onDeleteOne,
    onDeleteMany,
    onBulkStatusChange,
    onReplaceAll,
    onEditTechnology,
}) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        difficulty: "",
        deadline: "",
        resources: [""],
    });

    const [errors, setErrors] = useState({});
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkStatus, setBulkStatus] = useState("in-progress");
    const [importError, setImportError] = useState("");
    const [importSuccess, setImportSuccess] = useState("");
    const [editingId, setEditingId] = useState(null);
    const hasErrors = Object.keys(errors).length > 0;

    const updateField = (field, value) => {
        const updated = { ...form, [field]: value };
        setForm(updated);
        setErrors(validateForm(updated));
    };

    const updateResource = (index, value) => {
        const resources = [...form.resources];
        resources[index] = value;
        updateField("resources", resources);
    };

    const addResourceField = () => {
        updateField("resources", [...form.resources, ""]);
    };

    const removeResourceField = (index) => {
        const resources = form.resources.filter((_, i) => i !== index);
        updateField("resources", resources.length ? resources : [""]);
    };

    const startEditTechnology = (tech) => {
        setEditingId(tech.id);
        setForm({
            title: tech.title || "",
            description: tech.description || "",
            category: tech.category || "",
            difficulty: tech.difficulty || "",
            deadline: tech.deadline || "",
            resources:
                tech.resources && tech.resources.length
                    ? tech.resources
                    : [""],
        });
        setErrors(validateForm({
            title: tech.title || "",
            description: tech.description || "",
            category: tech.category || "",
            difficulty: tech.difficulty || "",
            deadline: tech.deadline || "",
            resources:
                tech.resources && tech.resources.length
                    ? tech.resources
                    : [""],
        }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm({
            title: "",
            description: "",
            category: "",
            difficulty: "",
            deadline: "",
            resources: [""],
        });
        setErrors({});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validation = validateForm(form);
        setErrors(validation);

        if (Object.keys(validation).length > 0) return;

        const cleanedResources = form.resources
            .map((r) => r.trim())
            .filter((r) => r.length > 0);

        const payload = {
            title: form.title.trim(),
            description: form.description.trim(),
            category: form.category,
            difficulty: form.difficulty,
            deadline: form.deadline,
            resources: cleanedResources,
        };

        if (editingId != null) {
            // режим редактирования
            onEditTechnology(editingId, payload);
        } else {
            // создание
            onAdd(payload);
        }

        setForm({
            title: "",
            description: "",
            category: "",
            difficulty: "",
            deadline: "",
            resources: [""],
        });
        setErrors({});
        setEditingId(null);
        navigate("/technologies");
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === 0) {
            setSelectedIds(technologies.map((t) => t.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleCheckbox = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) return;
        if (
            !window.confirm(
                "Вы уверены, что вы хотите удалить выбранные технологии?"
            )
        )
            return;

        onDeleteMany(selectedIds);
        setSelectedIds([]);
    };

    const handleDeleteOne = (id) => {
        if (
            !window.confirm(
                "Вы уверены, что вы хотите удалить выбранные технологии?"
            )
        )
            return;

        onDeleteOne(id);
        setSelectedIds((prev) => prev.filter((x) => x !== id));

        if (editingId === id) {
            cancelEdit();
        }
    };

    const handleBulkStatus = () => {
        if (selectedIds.length === 0) return;
        if (
            !window.confirm(
                "Применить выбранный статус ко всем выбранным технологиям?"
            )
        )
            return;

        onBulkStatusChange(selectedIds, bulkStatus);
    };

    const handleExportJson = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            technologies,
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "technologies-export.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const handleImportFile = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImportError("");
        setImportSuccess("");

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                const json = JSON.parse(text);

                let importedTechs = [];

                if (Array.isArray(json)) {
                    importedTechs = json;
                } else if (json && Array.isArray(json.technologies)) {
                    importedTechs = json.technologies;
                } else {
                    throw new Error("Неверный формат JSON");
                }

                importedTechs = importedTechs.map((t, index) => ({
                    id: t.id ?? index + 1,
                    title: t.title ?? "Без названия",
                    description: t.description ?? "",
                    status: t.status ?? "not-started",
                    notes: t.notes ?? "",
                    category: t.category ?? "other",
                    difficulty: t.difficulty ?? "beginner",
                    deadline: t.deadline ?? "",
                    resources: Array.isArray(t.resources) ? t.resources : [],
                }));

                onReplaceAll(importedTechs);
                setSelectedIds([]);
                setImportSuccess(
                    `Импортировано технологий: ${importedTechs.length}`
                );
                cancelEdit();
            } catch (err) {
                console.error(err);
                setImportError(
                    "Не удалось импортировать JSON: " + err.message
                );
            }
        };

        reader.onerror = () => {
            setImportError("Ошибка чтения файла");
        };

        reader.readAsText(file);
        event.target.value = "";
    };

    const titleErrorId = errors.title ? "title-error" : undefined;
    const categoryErrorId = errors.category ? "category-error" : undefined;
    const difficultyErrorId = errors.difficulty ? "difficulty-error" : undefined;
    const deadlineErrorId = errors.deadline ? "deadline-error" : undefined;

    return (
        <div className="page">
            <div className="page-header">
                <Link to="/technologies" className="back-link">
                    ← Назад к списку
                </Link>
                <h1>
                    Менеджер технологий
                    {editingId != null && " — редактирование"}
                </h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="add-tech-form"
                aria-describedby="form-errors"
            >
                <div className="form-group">
                    <label htmlFor="title">Название технологии *</label>
                    <input
                        id="title"
                        type="text"
                        value={form.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        required
                        placeholder="Например, React Router"
                        aria-invalid={!!errors.title}
                        aria-describedby={titleErrorId}
                    />
                    {errors.title && (
                        <p
                            id="title-error"
                            className="field-error"
                            role="alert"
                        >
                            {errors.title}
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Краткое описание</label>
                    <textarea
                        id="description"
                        rows="3"
                        value={form.description}
                        onChange={(e) =>
                            updateField("description", e.target.value)
                        }
                        placeholder="Опиши, что ты собираешься изучать"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="category">Категория *</label>
                        <select
                            id="category"
                            value={form.category}
                            onChange={(e) =>
                                updateField("category", e.target.value)
                            }
                            aria-invalid={!!errors.category}
                            aria-describedby={categoryErrorId}
                        >
                            <option value="">— выбери —</option>
                            <option value="frontend">Фронтенд</option>
                            <option value="backend">Бэкенд</option>
                            <option value="language">Язык</option>
                            <option value="tool">Инструмент</option>
                            <option value="other">Другое</option>
                        </select>
                        {errors.category && (
                            <p
                                id="category-error"
                                className="field-error"
                                role="alert"
                            >
                                {errors.category}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="difficulty">Уровень сложности *</label>
                        <select
                            id="difficulty"
                            value={form.difficulty}
                            onChange={(e) =>
                                updateField("difficulty", e.target.value)
                            }
                            aria-invalid={!!errors.difficulty}
                            aria-describedby={difficultyErrorId}
                        >
                            <option value="">— выбери —</option>
                            <option value="beginner">Начальный</option>
                            <option value="intermediate">Средний</option>
                            <option value="advanced">Продвинутый</option>
                        </select>
                        {errors.difficulty && (
                            <p
                                id="difficulty-error"
                                className="field-error"
                                role="alert"
                            >
                                {errors.difficulty}
                            </p>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="deadline">Дедлайн (необязательно)</label>
                    <input
                        id="deadline"
                        type="date"
                        value={form.deadline}
                        onChange={(e) =>
                            updateField("deadline", e.target.value)
                        }
                        aria-invalid={!!errors.deadline}
                        aria-describedby={deadlineErrorId}
                    />
                    {errors.deadline && (
                        <p
                            id="deadline-error"
                            className="field-error"
                            role="alert"
                        >
                            {errors.deadline}
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label>Полезные ресурсы (ссылки)</label>
                    {form.resources.map((res, index) => {
                        const resError =
                            errors.resources && errors.resources[index];
                        const resId = resError
                            ? `resource-error-${index}`
                            : undefined;

                        return (
                            <div key={index} className="resource-row">
                                <input
                                    type="text"
                                    value={res}
                                    placeholder="https://..."
                                    onChange={(e) =>
                                        updateResource(index, e.target.value)
                                    }
                                    aria-invalid={!!resError}
                                    aria-describedby={resId}
                                />
                                <button
                                    type="button"
                                    className="btn small"
                                    onClick={() =>
                                        removeResourceField(index)
                                    }
                                >
                                    ✕
                                </button>
                                {resError && (
                                    <p
                                        id={resId}
                                        className="field-error"
                                        role="alert"
                                    >
                                        {resError}
                                    </p>
                                )}
                            </div>
                        );
                    })}

                    <button
                        type="button"
                        className="btn"
                        onClick={addResourceField}
                    >
                        + Добавить ресурс
                    </button>
                </div>

                <div id="form-errors" aria-live="polite" className="form-hint">
                    {hasErrors
                        ? "Исправь ошибки в форме, чтобы продолжить."
                        : "Форма заполнена корректно."}
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={hasErrors}
                    >
                        {editingId != null ? "Сохранить изменения" : "Создать"}
                    </button>

                    {editingId != null && (
                        <button
                            type="button"
                            className="btn"
                            onClick={cancelEdit}
                        >
                            Отменить редактирование
                        </button>
                    )}
                </div>
            </form>

            <div className="import-export-section">
                <h2>Импорт / экспорт</h2>

                <div className="import-row">
                    <label className="btn">
                        Импорт из JSON
                        <input
                            type="file"
                            accept="application/json"
                            onChange={handleImportFile}
                            style={{ display: "none" }}
                        />
                    </label>
                    <button
                        type="button"
                        className="btn"
                        onClick={handleExportJson}
                    >
                        Экспорт в JSON
                    </button>
                </div>

                {importError && (
                    <p className="field-error" role="alert">
                        {importError}
                    </p>
                )}
                {importSuccess && (
                    <p className="import-success">{importSuccess}</p>
                )}
            </div>

            <div className="delete-tech-section">
                <h2>Список технологий</h2>

                {technologies.length === 0 ? (
                    <p>Пока нет ни одной технологии.</p>
                ) : (
                    <>
                        <div className="delete-tech-toolbar">
                            <button
                                type="button"
                                className="btn"
                                onClick={toggleSelectAll}
                            >
                                Выбрать все
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDeleteSelected}
                                disabled={selectedIds.length === 0}
                            >
                                Удалить выбранные
                            </button>

                            <div className="bulk-status-row">
                                <select
                                    value={bulkStatus}
                                    onChange={(e) =>
                                        setBulkStatus(e.target.value)
                                    }
                                >
                                    <option value="not-started">
                                        Не начато
                                    </option>
                                    <option value="in-progress">
                                        В процессе
                                    </option>
                                    <option value="completed">
                                        Завершено
                                    </option>
                                </select>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={handleBulkStatus}
                                    disabled={selectedIds.length === 0}
                                >
                                    Применить статус
                                </button>
                            </div>
                        </div>

                        <ul className="delete-tech-list">
                            {technologies.map((tech) => (
                                <li
                                    key={tech.id}
                                    className="delete-tech-item"
                                >
                                    <label className="delete-tech-label">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(
                                                tech.id
                                            )}
                                            onChange={() =>
                                                toggleCheckbox(tech.id)
                                            }
                                        />
                                        <span className="delete-tech-title">
                                            {tech.title}
                                        </span>
                                    </label>

                                    <div style={{ display: "flex", gap: 6 }}>
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={() =>
                                                startEditTechnology(tech)
                                            }
                                        >
                                            Редактировать
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() =>
                                                handleDeleteOne(tech.id)
                                            }
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}

export default AddTechnology;