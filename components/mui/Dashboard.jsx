import React from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    LinearProgress,
} from "@mui/material";

function Dashboard({ technologies }) {
    const stats = {
        total: technologies.length,
        completed: technologies.filter((t) => t.status === "completed").length,
        inProgress: technologies.filter(
            (t) => t.status === "in-progress"
        ).length,
        notStarted: technologies.filter(
            (t) => t.status === "not-started"
        ).length,
    };

    const progress =
        stats.total > 0
            ? Math.round((stats.completed / stats.total) * 100)
            : 0;

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
                Панель управления
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Всего технологий
                            </Typography>
                            <Typography variant="h4">
                                {stats.total}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Завершено
                            </Typography>
                            <Typography
                                variant="h4"
                                sx={{ color: "success.main" }}
                            >
                                {stats.completed}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                В процессе
                            </Typography>
                            <Typography
                                variant="h4"
                                sx={{ color: "warning.main" }}
                            >
                                {stats.inProgress}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Не начато
                            </Typography>
                            <Typography variant="h4">
                                {stats.notStarted}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Общий прогресс
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Box flex={1}>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{ height: 10, borderRadius: 5 }}
                            />
                        </Box>
                        <Typography variant="h6" color="primary">
                            {progress}%
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Dashboard;
