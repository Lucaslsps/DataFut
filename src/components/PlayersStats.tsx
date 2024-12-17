import { Box, MenuItem, Paper, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PlayerStatsChart from "../PlayerStatsChart";
import { Player } from "../interfaces";
import { getPlayerData } from "../services/repository/GetPlayerService";

// Helper function to calculate total goals and assists
const calculateTotals = (players: any[]) => {
  return players.map((player: { matches: any[] }) => ({
    ...player,
    totalG: structuredClone(player).matches.reduce(
      (sum: any, match: { g: string }) => sum + (match.g !== "-" ? match.g : 0),
      0
    ),
    totalA: structuredClone(player).matches.reduce(
      (sum: any, match: { a: string }) => sum + (match.a !== "-" ? match.a : 0),
      0
    ),
    totalP:
      structuredClone(player).matches.reduce(
        (sum: any, match: { g: string }) =>
          sum + (match.g !== "-" ? match.g : 0),
        0
      ) +
      structuredClone(player).matches.reduce(
        (sum: any, match: { a: string }) =>
          sum + (match.a !== "-" ? match.a : 0),
        0
      ),
  }));
};

function PlayerStats() {
  const [players, setPlayers] = useState([] as Player[]);
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    getPlayerData().then((data) => {
      setPlayers(data);
      setSelectedPlayer(data[0]);
      setLoadingData(false);
    });
  }, []);

  const handlePlayerChange = (event: any) => {
    const playerName = event.target.value;
    const player = players.find((p) => p.name === playerName);
    if (player) {
      setSelectedPlayer(player);
    }
  };

  return loadingData ? (
    <>Carregando...</>
  ) : (
    <Box sx={{ width: "100%", textAlign: "center", p: 2 }}>
      <Typography variant="h3" gutterBottom>
        Data Fut - Deportivo BCC
      </Typography>
      <Paper>
        {/* Dropdown to select player */}
        <Select value={selectedPlayer.name} onChange={handlePlayerChange}>
          {players
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((player) => (
              <MenuItem key={player.name} value={player.name}>
                {player.name}
              </MenuItem>
            ))}
        </Select>

        {/* Render the chart for the selected player */}
        <PlayerStatsChart player={selectedPlayer} />
      </Paper>
    </Box>
  );
}

export default PlayerStats;
