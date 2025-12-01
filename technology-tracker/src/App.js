import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import "./App.css";

import { theme, darkTheme } from "./styles/theme";
import useTechnologies from "./hooks/useTechnologies";

import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import TechnologyList from "./pages/TechnologyList";
import TechnologyDetail from "./pages/TechnologyDetail";
import AddTechnology from "./pages/AddTechnology";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import Api from "./pages/Api";
import UiKit from "./pages/UiKit";

function App() {
    const {
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
    } = useTechnologies();

    // 🔥 глобальная тема
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("appDarkMode");
        if (saved === "true") setDarkMode(true);
    }, []);

    useEffect(() => {
        localStorage.setItem("appDarkMode", darkMode ? "true" : "false");
        document.body.classList.toggle("dark", darkMode);
    }, [darkMode]);

    const toggleTheme = () => setDarkMode((prev) => !prev);

    const currentTheme = darkMode ? darkTheme : theme;

    return (
        <ThemeProvider theme={currentTheme}>
            <CssBaseline />
            <Router>
                <div className="app-root">
                    <Navigation />
                    <main className="main-content">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <Home
                                        progress={progress}
                                        total={technologies.length}
                                    />
                                }
                            />
                            <Route
                                path="/technologies"
                                element={
                                    <TechnologyList
                                        technologies={technologies}
                                        cycleStatus={cycleStatus}
                                        updateNotes={updateNotes}
                                        markAllCompleted={markAllCompleted}
                                        resetAll={resetAll}
                                    />
                                }
                            />
                            <Route
                                path="/technology/:techId"
                                element={
                                    <TechnologyDetail
                                        technologies={technologies}
                                        onUpdateStatus={updateStatus}
                                        onUpdateNotes={updateNotes}
                                    />
                                }
                            />
                            <Route
                                path="/add-technology"
                                element={
                                    <AddTechnology
                                        onAdd={addTechnology}
                                        technologies={technologies}
                                        onDeleteOne={deleteTechnology}
                                        onDeleteMany={deleteTechnologies}
                                        onBulkStatusChange={bulkUpdateStatus}
                                        onReplaceAll={replaceAll}
                                        onEditTechnology={editTechnology}
                                    />
                                }
                            />
                            <Route
                                path="/stats"
                                element={
                                    <Stats
                                        technologies={technologies}
                                        progress={progress}
                                    />
                                }
                            />
                            <Route
                                path="/settings"
                                element={
                                    <Settings
                                        onResetStatuses={resetAll}
                                        onMarkAllCompleted={markAllCompleted}
                                        onResetToDefaults={resetToDefaults}
                                    />
                                }
                            />
                            <Route path="/api" element={<Api />} />
                            <Route
                                path="/ui-kit"
                                element={
                                    <UiKit
                                        technologies={technologies}
                                        onStatusChange={updateStatus}
                                        onAddTechnology={addTechnology}
                                        darkMode={darkMode}
                                        onToggleTheme={toggleTheme}
                                    />
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;