import { Box, Container, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import PlayerStatsChart from "../../PlayerStatsChart";
import { Player } from "../../interfaces";
import { getPlayerData } from "../../repository/GetPlayerService";
import { getPlayerTags } from "../../services/StatsService";

function PlayerStats() {
  const [players, setPlayers] = useState([] as Player[]);
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    getPlayerData().then((data) => {
      setPlayers(data);
      setSelectedPlayer(data.sort((a, b) => a.name.localeCompare(b.name))[0]);
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
      <Container>
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
        <PlayerStatsChart
          player={selectedPlayer}
          tags={getPlayerTags(players, selectedPlayer)}
        />
      </Container>
    </Box>
  );
}

export default PlayerStats;
