import { Avatar, Box, Container, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import PlayerStatsChart from "../../PlayerStatsChart";
import { Player } from "../../interfaces";
import { getPlayerData } from "../../repository/GetPlayerService";
import { getPlayerTags } from "../../services/StatsService";
import { useUserContext } from "../../contexts/UserProvider";

function PlayerStats() {
  const { user } = useUserContext();
  const [players, setPlayers] = useState([] as Player[]);
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    getPlayerData().then((data) => {
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
      const currentPlayer =
        user && user.playerId
          ? data.findIndex((playerData) => playerData.id === user.playerId)
          : 0;
      setPlayers(data);
      setSelectedPlayer(sortedData[currentPlayer]);
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
        <Container style={{ display: "flex", justifyContent: "center" }}>
          <Avatar
            src={selectedPlayer.user?.avatarUrl}
            alt="User Avatar"
            sx={{
              width: 50,
              height: 50,
              marginRight: "1em",
            }}
          />

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
        </Container>
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
