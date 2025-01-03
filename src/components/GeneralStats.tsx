import { Box, Grid2, MenuItem, Select, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Player } from "../interfaces";
import { getPlayerData } from "../repository/GetPlayerService";
import {
  calculateTotals,
  getTop3,
  isTop3,
  getPlayerRank,
} from "../services/StatsService";

function GeneralStats() {
  const [players, setPlayers] = useState([] as Player[]);
  const [initialPlayers, setInitialPlayers] = useState([] as Player[]);
  const [loadingData, setLoadingData] = useState(true);
  const [yearFilter, setYearFilter] = useState("");
  const [yearsInDataset, setYearsInDataset] = useState([] as string[]);
  const playersData = calculateTotals(players);
  const top3Goals = getTop3(playersData, "totalG");
  const top3Assists = getTop3(playersData, "totalA");
  const top3Participacoes = getTop3(playersData, "totalP");

  useEffect(() => {
    getPlayerData().then((data) => {
      setPlayers(data);
      setInitialPlayers(data);
      const { years, highestYear } = getHighestYearFromDataset(data);
      setYearFilter(highestYear);
      setYearsInDataset(years);
      setLoadingData(false);
    });
  }, []);

  function getHighestYearFromDataset(playersInDataset: Player[]) {
    const years = Array.from(
      new Set(
        playersInDataset.flatMap((person) =>
          person.matches.map(
            (match) => match.date.split("/")[2] // Extract the year part
          )
        )
      )
    );

    return {
      years: years,
      highestYear: String(years.sort()[0]),
    };
  }

  function handleYearFilterChange(event: any) {
    const selectedYear = event.target.value;

    const filteredPlayerByYear = initialPlayers.map((player) => ({
      ...player,
      matches: player.matches.filter(
        (match) => match.date.split("/")[2] === selectedYear
      ),
    }));
    setYearFilter(selectedYear);
    setPlayers(filteredPlayerByYear);
  }

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
              isTop3({ name: params.value }, top3Goals) ||
              isTop3({ name: params.value }, top3Assists)
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
            fontWeight: isTop3(params.row, top3Goals) ? "bold" : "normal",
            color: isTop3(params.row, top3Goals) ? "green" : "black",
            backgroundColor: isTop3(params.row, top3Goals)
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
            fontWeight: isTop3(params.row, top3Assists) ? "bold" : "normal",
            color: isTop3(params.row, top3Assists) ? "blue" : "black",
            backgroundColor: isTop3(params.row, top3Assists)
              ? "#cce5ff"
              : "white",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    /*     { field: "g1", headerName: "10/08 G", type: "number", flex: 0.3 },
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
    { field: "a6", headerName: "19/10 A", type: "number", flex: 0.3 }, */
  ];

  const rows = playersData.map((player: any, id: any) => ({
    id,
    name: player.name,
    totalG: player.totalG,
    totalA: player.totalA,
    /*     g1: player.matches[0]?.g,
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
    a6: player.matches[5]?.a, */
  }));

  return loadingData ? (
    <>Carregando...</>
  ) : (
    <Box sx={{ width: "100%", textAlign: "center", p: 2 }}>
      <Typography variant="h3" gutterBottom>
        Data Fut - Deportivo BCC
      </Typography>
      <Select value={yearFilter} onChange={handleYearFilterChange}>
        {yearsInDataset.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
      <Grid2
        container
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-around"
        mt={4}
      >
        {/* Top 3 Artilheiros Podium */}
        <Grid2>
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
        </Grid2>

        {/* Top 3 Garçons Podium */}
        <Grid2>
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
        </Grid2>

        {/* Top 3 Participações Podium */}
        <Grid2>
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
        </Grid2>
      </Grid2>

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

export default GeneralStats;
