import React, { useState } from "react";
import {
    Box,
    Container,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Grid,
    Tabs,
    Tab,
    Snackbar,
    Alert,
    FormControlLabel,
    Switch,
} from "@mui/material";
import {
    Add as AddIcon,
    Dashboard as DashboardIcon,
    List as ListIcon,
    Brightness4 as Brightness4Icon,
} from "@mui/icons-material";

import SimpleTechCard from "../components/mui/SimpleTechCard";
import Dashboard from "../components/mui/Dashboard";

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`mui-tabpanel-${index}`}
            aria-labelledby={`mui-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function UiKit({
    technologies,
    onStatusChange,
    onAddTechnology,
    darkMode,
    onToggleTheme,
}) {
    const [tabValue, setTabValue] = useState(0);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    const openSnackbar = (message, severity = "info") => {
        setSnackbarMsg(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (_, reason) => {
        if (reason === "clickaway") return;
        setSnackbarOpen(false);
    };

    const handleTabChange = (_, newValue) => {
        setTabValue(newValue);
    };

    const handleStatusChange = (techId, newStatus) => {
        onStatusChange(techId, newStatus);
        const tech = technologies.find((t) => t.id === techId);
        openSnackbar(
            `Статус "${tech?.title || "Технология"}" изменён на "${newStatus}"`,
            "success"
        );
    };

    const addNewTechnology = () => {
        onAddTechnology({
            title: `Новая технология ${technologies.length + 1}`,
            description: "Описание новой технологии для изучения",
            category: "other",
            difficulty: "beginner",
            deadline: "",
            resources: [],
        });
        openSnackbar("Добавлена новая технология", "info");
    };

    return (
        <Box
            sx={{
                flexGrow: 1,
                minHeight: "100vh",
                backgroundColor: "background.default",
            }}
        >
            <AppBar position="static" elevation={2}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        🧩 UI-кит (MUI) для трекера технологий
                    </Typography>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={darkMode}
                                onChange={onToggleTheme}
                                color="default"
                            />
                        }
                        label={
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                }}
                            >
                                <Brightness4Icon fontSize="small" />
                                <span>Тёмная тема</span>
                            </Box>
                        }
                        sx={{ mr: 2 }}
                    />
                </Toolbar>
            </AppBar>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="mui tabs"
                    variant="scrollable"
                >
                    <Tab icon={<ListIcon />} label="Список технологий" />
                    <Tab icon={<DashboardIcon />} label="Дашборд" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            Мои технологии (MUI интерфейс)
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={addNewTechnology}
                            size="large"
                            sx={{ mb: 3 }}
                        >
                            Добавить технологию
                        </Button>
                    </Box>

                    <Grid container spacing={3}>
                        {technologies.map((technology) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                key={technology.id}
                            >
                                <SimpleTechCard
                                    technology={technology}
                                    onStatusChange={handleStatusChange}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    {technologies.length === 0 && (
                        <Box textAlign="center" py={8} color="text.secondary">
                            <Typography variant="h6" gutterBottom>
                                Технологий пока нет
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={addNewTechnology}
                                sx={{ mt: 2 }}
                            >
                                Добавить технологию
                            </Button>
                        </Box>
                    )}
                </Container>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Container maxWidth="lg">
                    <Dashboard technologies={technologies} />
                </Container>
            </TabPanel>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default UiKit;