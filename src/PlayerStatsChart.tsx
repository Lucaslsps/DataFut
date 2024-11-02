import React, { useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
  LabelList,
} from "recharts";
import { Box, Divider, Paper, Typography } from "@mui/material";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer"; // Icon for goals
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Icon for assists
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople"; // Icon for participations

import { PlayerStatsChartProps } from "./interfaces";

const PlayerStatsChart: React.FC<PlayerStatsChartProps> = ({ player }) => {
  // Process and structure the data for the chart
  const chartData = useMemo(() => {
    return player.matches.map((match, index) => ({
      date: `Partida ${index + 1}`, // You can replace this with an actual date if available
      goals: match.g !== null ? match.g : 0,
      assists: match.a !== null ? match.a : 0,
    }));
  }, [player]);

  // Calculate totals for summary
  const totalGoals = chartData.reduce(
    (sum, match) => sum + (typeof match.goals == "string" ? 0 : match.goals),
    0
  );
  const totalAssists = chartData.reduce(
    (sum, match) =>
      sum + (typeof match.assists == "string" ? 0 : match.assists),
    0
  );
  const totalGoalsAssists = totalGoals + totalAssists;

  return (
    <Box sx={{ mt: 4, width: "100%" }}>
      {/* Enhanced summary section */}
      <Paper
        elevation={4}
        sx={{
          mb: 3,
          p: 2,
          backgroundColor: "#f7f9fc",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Assists */}
        <Box sx={{ textAlign: "center" }}>
          <EmojiEventsIcon sx={{ color: "#388e3c", fontSize: 40 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
            Assistências
          </Typography>
          <Typography variant="h5" sx={{ color: "#388e3c" }}>
            {totalAssists}
          </Typography>
        </Box>

        {/* Goals */}
        <Box sx={{ textAlign: "center" }}>
          <SportsSoccerIcon sx={{ color: "#1976d2", fontSize: 40 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
            Gols
          </Typography>
          <Typography variant="h5" sx={{ color: "#1976d2" }}>
            {totalGoals}
          </Typography>
        </Box>

        {/* Participations (Goals + Assists) */}
        <Box sx={{ textAlign: "center" }}>
          <EmojiPeopleIcon sx={{ color: "#f57c00", fontSize: 40 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
            Participações
          </Typography>
          <Typography variant="h5" sx={{ color: "#f57c00" }}>
            {totalGoalsAssists}
          </Typography>
        </Box>
      </Paper>

      <Divider />

      {/* Responsive container to make the chart responsive */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* Bar for goals */}
          <Bar dataKey="goals" fill="#D35400">
            {/* Label for each bar */}
            <LabelList dataKey="goals" position="top" />
          </Bar>

          {/* Bar for assists */}
          <Bar dataKey="assists" fill="#F2C94C">
            {/* Label for each bar */}
            <LabelList dataKey="assists" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PlayerStatsChart;
