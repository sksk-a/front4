import useLocalStorage from "./useLocalStorage";

const initialTechnologies = [
    {
        id: 1,
        title: "Компоненты React",
        description: "Изучение базовых компонентов",
        status: "not-started",
        notes: "",
    },
    {
        id: 2,
        title: "JSX",
        description: "Основы JSX",
        status: "not-started",
        notes: "",
    },
    {
        id: 3,
        title: "React State",
        description: "Работа с состоянием",
        status: "not-started",
        notes: "",
    },
];

function useTechnologies() {
    const [technologies, setTechnologies] = useLocalStorage(
        "technologies",
        initialTechnologies
    );

    const cycleStatus = (techId) => {
        setTechnologies((prev) =>
            prev.map((tech) => {
                if (tech.id !== techId) return tech;

                let next = "not-started";
                if (tech.status === "not-started") next = "in-progress";
                else if (tech.status === "in-progress") next = "completed";
                else if (tech.status === "completed") next = "not-started";

                return { ...tech, status: next };
            })
        );
    };

    const updateStatus = (techId, newStatus) => {
        setTechnologies((prev) =>
            prev.map((tech) =>
                tech.id === techId ? { ...tech, status: newStatus } : tech
            )
        );
    };

    const updateNotes = (techId, notes) => {
        setTechnologies((prev) =>
            prev.map((tech) =>
                tech.id === techId ? { ...tech, notes } : tech
            )
        );
    };

    const markAllCompleted = () => {
        setTechnologies((prev) =>
            prev.map((t) => ({ ...t, status: "completed" }))
        );
    };

    const resetAll = () => {
        setTechnologies((prev) =>
            prev.map((t) => ({ ...t, status: "not-started" }))
        );
    };

    const addTechnology = ({
        title,
        description,
        category,
        difficulty,
        deadline,
        resources,
    }) => {
        setTechnologies((prev) => {
            const nextId =
                prev.length === 0
                    ? 1
                    : Math.max(...prev.map((t) => t.id)) + 1;

            return [
                ...prev,
                {
                    id: nextId,
                    title,
                    description,
                    status: "not-started",
                    notes: "",
                    category: category || "other",
                    difficulty: difficulty || "beginner",
                    deadline: deadline || "",
                    resources: resources && resources.length ? resources : [],
                },
            ];
        });
    };

    const deleteTechnology = (id) => {
        setTechnologies((prev) => prev.filter((t) => t.id !== id));
    };

    const deleteTechnologies = (ids) => {
        if (!ids || ids.length === 0) return;
        setTechnologies((prev) => prev.filter((t) => !ids.includes(t.id)));
    };

    const bulkUpdateStatus = (ids, status) => {
        if (!ids || ids.length === 0 || !status) return;
        setTechnologies((prev) =>
            prev.map((t) =>
                ids.includes(t.id) ? { ...t, status } : t
            )
        );
    };

    const editTechnology = (id, data) => {
        setTechnologies((prev) =>
            prev.map((t) =>
                t.id === id
                    ? {
                        ...t,
                        ...data,
                    }
                    : t
            )
        );
    };

    const resetToDefaults = () => {
        setTechnologies(initialTechnologies);
    };

    const replaceAll = (newTechnologies) => {
        setTechnologies(newTechnologies);
    };

    const progress =
        technologies.length === 0
            ? 0
            : Math.round(
                (technologies.filter((t) => t.status === "completed").length /
                    technologies.length) *
                100
            );

    return {
        technologies,
        cycleStatus,
        updateStatus,
        updateNotes,
        markAllCompleted,
        resetAll,
        addTechnology,
        deleteTechnology,
        deleteTechnologies,
        bulkUpdateStatus,
        editTechnology,
        resetToDefaults,
        replaceAll,
        progress,
    };
}

export default useTechnologies;