import { Box, MenuItem, Paper, Select, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import PlayerStatsChart from "./PlayerStatsChart";
import { Player } from "./interfaces";

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

const getTop3 = (players: any, field: string) => {
  return [...players].sort((a, b) => b[field] - a[field]).slice(0, 3);
};

// Function to check if player is in top 3 of goals or assists
const isTop3 = (player: { name: any }, field: string, top3List: any[]) => {
  return top3List.some(
    (topPlayer: { name: any }) => topPlayer.name === player.name
  );
};

// Function to determine the rank of a player based on a specified field (goals or assists)
const getPlayerRank = (playerName: any, topPlayers: any[]) => {
  const rankIndex = topPlayers.findIndex(
    (player: { name: any }) => player.name === playerName
  );

  if (rankIndex === 0) return "🥇"; // 1st place
  if (rankIndex === 1) return "🥈"; // 2nd place
  if (rankIndex === 2) return "🥉"; // 3rd place
  return ""; // Not in the top 3
};

function App() {
  const rawPlayersData: Player[] = [
    {
      name: "Xande",
      matches: [
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: 2, a: 0 },
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: 2, a: 0 },
      ],
    },
    {
      name: "Bersi",
      matches: [
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: 1, a: 0 },
        { g: 0, a: 0 },
        { g: 1, a: 1 },
        { g: 1, a: 0 },
      ],
    },
    {
      name: "Daniboy",
      matches: [
        { g: 2, a: 1 },
        { g: 1, a: 1 },
        { g: 1, a: 0 },
        { g: 2, a: 1 },
        { g: 3, a: 1 },
        { g: 2, a: 1 },
      ],
    },
    {
      name: "Denes",
      matches: [
        { g: 1, a: 1 },
        { g: 1, a: 1 },
        { g: 3, a: 1 },
        { g: 1, a: 1 },
        { g: 2, a: 0 },
        { g: 0, a: 0 },
      ],
    },
    {
      name: "Godoy",
      matches: [
        { g: 1, a: 0 },
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
      ],
    },
    {
      name: "Luan",
      matches: [
        { g: 0, a: 1 },
        { g: 0, a: 0 },
        { g: 2, a: 2 },
        { g: 2, a: 3 },
        { g: 0, a: 2 },
        { g: 1, a: 1 },
      ],
    },
    {
      name: "Peace",
      matches: [
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: 1, a: 0 },
        { g: 0, a: 0 },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
      ],
    },
    {
      name: "Kim",
      matches: [
        { g: 1, a: 0 },
        { g: 3, a: 0 },
        { g: "-", a: "-" },
        { g: 1, a: 0 },
        { g: 3, a: 1 },
        { g: 1, a: 1 },
      ],
    },
    {
      name: "Mafes",
      matches: [
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: "-", a: "-" },
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: 0, a: 2 },
      ],
    },
    {
      name: "Mencalha",
      matches: [
        { g: 5, a: 2 },
        { g: 4, a: 3 },
        { g: 3, a: 3 },
        { g: 0, a: 3 },
        { g: 2, a: 1 },
        { g: 3, a: 7 },
      ],
    },
    {
      name: "Prestes",
      matches: [
        { g: 0, a: 1 },
        { g: 1, a: 1 },
        { g: 1, a: 0 },
        { g: 0, a: 0 },
        { g: "-", a: "-" },
        { g: 1, a: 0 },
      ],
    },
    {
      name: "Pedro",
      matches: [
        { g: 1, a: 1 },
        { g: 0, a: 0 },
        { g: 2, a: 1 },
        { g: 2, a: 2 },
        { g: 2, a: 1 },
        { g: 1, a: 1 },
      ],
    },
    {
      name: "Siqueira",
      matches: [
        { g: 0, a: 0 },
        { g: "-", a: "-" },
        { g: 1, a: 0 },
        { g: 0, a: 1 },
        { g: 0, a: 0 },
        { g: 1, a: 0 },
      ],
    },
    {
      name: "Diniz",
      matches: [
        { g: 0, a: 0 },
        { g: 4, a: 1 },
        { g: 3, a: 3 },
        { g: 1, a: 1 },
        { g: "-", a: "-" },
        { g: 3, a: 1 },
      ],
    },
    {
      name: "Rafael",
      matches: [
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: "-", a: "-" },
        { g: 6, a: 2 },
        { g: 4, a: 0 },
        { g: 5, a: 4 },
      ],
    },
    {
      name: "SAJ",
      matches: [
        { g: 0, a: 0 },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
        { g: 0, a: 0 },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
      ],
    },
    {
      name: "Vinibala",
      matches: [
        { g: 1, a: 0 },
        { g: 0, a: 1 },
        { g: 0, a: 1 },
        { g: 0, a: 0 },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
      ],
    },
    {
      name: "Vinigod",
      matches: [
        { g: 2, a: 0 },
        { g: 1, a: 0 },
        { g: 0, a: 2 },
        { g: 0, a: 2 },
        { g: "-", a: "-" },
        { g: 4, a: 1 },
      ],
    },
    {
      name: "Hugo",
      matches: [
        { g: 0, a: 0 },
        { g: 0, a: 1 },
        { g: 0, a: 0 },
        { g: 0, a: 1 },
        { g: 0, a: 0 },
        { g: 0, a: 0 },
      ],
    },
    {
      name: "Peixoto",
      matches: [
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: 1, a: 1 },
        { g: 1, a: 1 },
        { g: 0, a: 0 },
        { g: 1, a: 0 },
      ],
    },
    {
      name: "Theodoro",
      matches: [
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
      ],
    },
    {
      name: "Danilo (Pxt)",
      matches: [
        { g: 3, a: 0 },
        { g: 0, a: 0 },
        { g: 2, a: 1 },
        { g: "-", a: "-" },
        { g: 1, a: 4 },
        { g: 4, a: 2 },
      ],
    },
    {
      name: "Daniel (Pxt)",
      matches: [
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: 1, a: 0 },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
      ],
    },
    {
      name: "Jonas (Pxt)",
      matches: [
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
      ],
    },
    {
      name: "Guilherme (Mencalha)",
      matches: [
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
      ],
    },
    {
      name: "Douglas (Mencalha)",
      matches: [
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: 0, a: 0 },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
      ],
    },
    {
      name: "Heitor (Mencalha)",
      matches: [
        { g: "-", a: "-" },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
        { g: 1, a: 1 },
        { g: "-", a: "-" },
      ],
    },
    {
      name: "Carol (Daniboy)",
      matches: [
        { g: "-", a: "-" },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
        { g: 0, a: 0 },
        { g: 0, a: 1 },
      ],
    },
    {
      name: "Berpai",
      matches: [
        { g: "-", a: "-" },
        { g: "-", a: "-" },
        { g: 1, a: 0 },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
        { g: "-", a: "-" },
      ],
    },
  ];

  const [selectedPlayer, setSelectedPlayer] = useState(rawPlayersData[0]);
  const playersData = calculateTotals(rawPlayersData);
  const top3Goals = getTop3(playersData, "totalG");
  const top3Assists = getTop3(playersData, "totalA");
  const top3Participacoes = getTop3(playersData, "totalP");

  const handlePlayerChange = (event: any) => {
    const playerName = event.target.value;
    const player = rawPlayersData.find((p) => p.name === playerName);
    if (player) {
      setSelectedPlayer(player);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Jogadores",
      flex: 1,
      minWidth: 50,
      renderCell: (params: any) => (
        <Box>
          <Typography
            fontWeight={
              isTop3({ name: params.value }, "totalG", top3Goals) ||
              isTop3({ name: params.value }, "totalA", top3Assists)
                ? "bold"
                : "normal"
            }
          >
            {params.value}
            {getPlayerRank(params.value, top3Goals)}
            {getPlayerRank(params.value, top3Assists)}
          </Typography>
        </Box>
      ),
    },
    {
      field: "totalG",
      headerName: "Total G",
      type: "number",
      flex: 0.5,
      align: "center", // This centers the content of the cell
      headerAlign: "center", // This centers the header text
      renderCell: (params: any) => (
        <Box
          sx={{
            fontWeight: isTop3(params.row, "totalG", top3Goals)
              ? "bold"
              : "normal",
            color: isTop3(params.row, "totalG", top3Goals) ? "green" : "black",
            backgroundColor: isTop3(params.row, "totalG", top3Goals)
              ? "#d4edda"
              : "white",
            textAlign: "center", // Ensure text is centered inside the custom rendered cell
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "totalA",
      headerName: "Total A",
      type: "number",
      flex: 0.5,
      align: "center",
      renderCell: (params: any) => (
        <Box
          sx={{
            fontWeight: isTop3(params.row, "totalA", top3Assists)
              ? "bold"
              : "normal",
            color: isTop3(params.row, "totalA", top3Assists) ? "blue" : "black",
            backgroundColor: isTop3(params.row, "totalA", top3Assists)
              ? "#cce5ff"
              : "white",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    { field: "g1", headerName: "10/08 G", type: "number", flex: 0.3 },
    { field: "a1", headerName: "10/08 A", type: "number", flex: 0.3 },
    { field: "g2", headerName: "24/08 G", type: "number", flex: 0.3 },
    { field: "a2", headerName: "24/08 A", type: "number", flex: 0.3 },
    { field: "g3", headerName: "07/09 G", type: "number", flex: 0.3 },
    { field: "a3", headerName: "07/09 A", type: "number", flex: 0.3 },
    { field: "g4", headerName: "21/09 G", type: "number", flex: 0.3 },
    { field: "a4", headerName: "21/09 A", type: "number", flex: 0.3 },
    { field: "g5", headerName: "05/10 G", type: "number", flex: 0.3 },
    { field: "a5", headerName: "05/10 A", type: "number", flex: 0.3 },
    { field: "g6", headerName: "19/10 G", type: "number", flex: 0.3 },
    { field: "a6", headerName: "19/10 A", type: "number", flex: 0.3 },
  ];

  const rows = playersData.map((player: any, id: any) => ({
    id,
    name: player.name,
    totalG: player.totalG,
    totalA: player.totalA,
    g1: player.matches[0]?.g,
    a1: player.matches[0]?.a,
    g2: player.matches[1]?.g,
    a2: player.matches[1]?.a,
    g3: player.matches[2]?.g,
    a3: player.matches[2]?.a,
    g4: player.matches[3]?.g,
    a4: player.matches[3]?.a,
    g5: player.matches[4]?.g,
    a5: player.matches[4]?.a,
    g6: player.matches[5]?.g,
    a6: player.matches[5]?.a,
  }));

  return (
    <Box sx={{ width: "100%", textAlign: "center", p: 2 }}>
      <Typography variant="h3" gutterBottom>
        Data Fut - Deportivo BCC
      </Typography>
      <Paper>
        {/* Dropdown to select player */}
        <Select value={selectedPlayer.name} onChange={handlePlayerChange}>
          {rawPlayersData
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
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-around"
        mt={4}
      >
        {/* Top 3 Artilheiros Podium */}
        <Box>
          <Typography variant="h6" align="center" fontWeight="bold">
            Top 3 Artilheiros:
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="flex-end"
            mt={2}
          >
            {/* 2nd place */}
            <Box
              width={{ xs: "80%", sm: 120 }}
              height={150}
              bgcolor="silver"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              mx={1}
              flexDirection="column"
            >
              <Typography>🥈</Typography>
              <Typography variant="subtitle1" align="center" fontWeight="bold">
                2º {top3Goals[1].name}
              </Typography>
              <Typography>{top3Goals[1].totalG} Gols</Typography>
            </Box>

            {/* 1st place */}
            <Box
              width={{ xs: "80%", sm: 120 }}
              height={200}
              bgcolor="gold"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              mx={1}
              flexDirection="column"
            >
              <Typography>🥇</Typography>
              <Typography variant="subtitle1" align="center" fontWeight="bold">
                1º {top3Goals[0].name}
              </Typography>
              <Typography>{top3Goals[0].totalG} Gols</Typography>
            </Box>

            {/* 3rd place */}
            <Box
              width={{ xs: "80%", sm: 120 }}
              height={120}
              bgcolor="#cd7f32"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              mx={1}
              flexDirection="column"
            >
              <Typography>🥉</Typography>
              <Typography variant="subtitle1" align="center" fontWeight="bold">
                3º {top3Goals[2].name}
              </Typography>
              <Typography>{top3Goals[2].totalG} Gols</Typography>
            </Box>
          </Box>
        </Box>

        {/* Top 3 Participações Podium */}
        <Box>
          <Typography variant="h6" align="center" fontWeight="bold">
            Top 3 Participações:
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="flex-end"
            mt={2}
          >
            {/* 2nd place */}
            <Box
              width={{ xs: "80%", sm: 120 }}
              height={150}
              bgcolor="silver"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              mx={1}
              flexDirection="column"
            >
              <Typography>🥈</Typography>
              <Typography variant="subtitle1" align="center" fontWeight="bold">
                2º {top3Participacoes[1].name}
              </Typography>
              <Typography>
                {top3Participacoes[1].totalP} Participações
              </Typography>
            </Box>

            {/* 1st place */}
            <Box
              width={{ xs: "80%", sm: 120 }}
              height={200}
              bgcolor="gold"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              mx={1}
              flexDirection="column"
            >
              <Typography>🥇</Typography>
              <Typography variant="subtitle1" align="center" fontWeight="bold">
                1º {top3Participacoes[0].name}
              </Typography>
              <Typography>
                {top3Participacoes[0].totalP} Participações
              </Typography>
            </Box>

            {/* 3rd place */}
            <Box
              width={{ xs: "80%", sm: 120 }}
              height={120}
              bgcolor="#cd7f32"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              mx={1}
              flexDirection="column"
            >
              <Typography>🥉</Typography>
              <Typography variant="subtitle1" align="center" fontWeight="bold">
                3º {top3Participacoes[2].name}
              </Typography>
              <Typography>
                {top3Participacoes[2].totalP} Participações
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Top 3 Garçons Podium */}
        <Box>
          <Typography
            variant="h6"
            align="center"
            fontWeight="bold"
            mt={{ xs: 2, sm: 0 }}
          >
            Top 3 Garçons:
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="flex-end"
            mt={2}
          >
            {/* 2nd place */}
            <Box
              width={{ xs: "80%", sm: 120 }}
              height={150}
              bgcolor="silver"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              mx={1}
              flexDirection="column"
            >
              <Typography>🥈</Typography>
              <Typography variant="subtitle1" align="center" fontWeight="bold">
                2º {top3Assists[1].name}
              </Typography>
              <Typography>{top3Assists[1].totalA} Assistências</Typography>
            </Box>

            {/* 1st place */}
            <Box
              width={{ xs: "80%", sm: 120 }}
              height={200}
              bgcolor="gold"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              mx={1}
              flexDirection="column"
            >
              <Typography>🥇</Typography>
              <Typography variant="subtitle1" align="center" fontWeight="bold">
                1º {top3Assists[0].name}
              </Typography>
              <Typography>{top3Assists[0].totalA} Assistências</Typography>
            </Box>

            {/* 3rd place */}
            <Box
              width={{ xs: "80%", sm: 120 }}
              height={120}
              bgcolor="#cd7f32"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              mx={1}
              flexDirection="column"
            >
              <Typography>🥉</Typography>
              <Typography variant="subtitle1" align="center" fontWeight="bold">
                3º {top3Assists[2].name}
              </Typography>
              <Typography>{top3Assists[2].totalA} Assistências</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Player Stats DataGrid */}
      <Box
        sx={{
          width: { xs: "100%", sm: "70%" },
          margin: "20px auto",
          height: "500px",
        }}
      >
        <DataGrid rows={rows} columns={columns} autoHeight />
      </Box>
    </Box>
  );
}

export default App;
