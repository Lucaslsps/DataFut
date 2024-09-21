import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// Helper function to calculate total goals and assists
const calculateTotals = (players: any[]) => {
  return players.map((player: { name: string, matches: any[]; }) => ({
    ...player,
    totalG: player.matches.reduce((sum: any, match: { g: string; }) => sum + (match.g !== '-' ? match.g : 0), 0),
    totalA: player.matches.reduce((sum: any, match: { a: string; }) => sum + (match.a !== '-' ? match.a : 0), 0),
  }));
};

const getTop3 = (players: any, field: string) => {
  return [...players]
    .sort((a, b) => b[field] - a[field])
    .slice(0, 3);
};

function App() {
  const rawPlayersData = [
    { name: 'Xande', matches: [{ g: 0, a: 0 }, { g: 0, a: 0 }, { g: 2, a: 0 }, { g: 0, a: 0 }] },
    { name: 'Bersi', matches: [{ g: 0, a: 0 }, { g: 0, a: 0 }, { g: 1, a: 0 }, { g: 0, a: 0 }] },
    { name: 'Daniboy', matches: [{ g: 2, a: 1 }, { g: 1, a: 1 }, { g: 1, a: 0 }, { g: 2, a: 1 }] },
    { name: 'Denes', matches: [{ g: 1, a: 1 }, { g: 1, a: 1 }, { g: 3, a: 1 }, { g: 1, a: 1 }] },
    { name: 'Godoy', matches: [{ g: 1, a: 0 }, { g: 0, a: 0 }, { g: 0, a: 0 }, { g: '-', a: '-' }] },
    { name: 'Luan', matches: [{ g: 0, a: 1 }, { g: 0, a: 0 }, { g: 2, a: 2 }, { g: 2, a: 3 }] },
    { name: 'Peace', matches: [{ g: 0, a: 0 }, { g: 0, a: 0 }, { g: 1, a: 0 }, { g: 0, a: 0 }] },
    { name: 'Carvalho', matches: [{ g: 0, a: 0 }, { g: 0, a: 0 }, { g: 0, a: 0 }, { g: 0, a: 0 }] },
    { name: 'Kim', matches: [{ g: 1, a: 0 }, { g: 3, a: 0 }, { g: '-', a: '-' }, { g: 1, a: 0 }] },
    { name: 'Mafes', matches: [{ g: 0, a: 0 }, { g: 0, a: 0 }, { g: '-', a: '-' }, { g: 0, a: 0 }] },
    { name: 'Mencalha', matches: [{ g: 5, a: 2 }, { g: 4, a: 3 }, { g: 3, a: 3 }, { g: 0, a: 3 }] },
    { name: 'Prestes', matches: [{ g: 0, a: 1 }, { g: 1, a: 1 }, { g: 1, a: 0 }, { g: 0, a: 0 }] },
    { name: 'Pedro', matches: [{ g: 1, a: 1 }, { g: 0, a: 0 }, { g: 2, a: 1 }, { g: 2, a: 2 }] },
    { name: 'Siqueira', matches: [{ g: 0, a: 0 }, { g: '-', a: '-' }, { g: 1, a: 0 }, { g: 0, a: 1 }] },
    { name: 'Diniz', matches: [{ g: 0, a: 0 }, { g: 4, a: 1 }, { g: 3, a: 3 }, { g: 1, a: 1 }] },
    { name: 'Rafael', matches: [{ g: 0, a: 0 }, { g: 0, a: 0 }, { g: '-', a: '-' }, { g: 6, a: 2 }] },
    { name: 'SAJ', matches: [{ g: 0, a: 0 }, { g: '-', a: '-' }, { g: '-', a: '-' }, { g: 0, a: 0 }] },
    { name: 'Vinibala', matches: [{ g: 1, a: 0 }, { g: 0, a: 1 }, { g: 0, a: 1 }, { g: 0, a: 0 }] },
    { name: 'Vinigoid', matches: [{ g: 2, a: 0 }, { g: 1, a: 0 }, { g: 0, a: 2 }, { g: 0, a: 2 }] },
    { name: 'Hugo', matches: [{ g: 0, a: 0 }, { g: 0, a: 1 }, { g: 0, a: 0 }, { g: 0, a: 1 }] },
    { name: 'Peixoto', matches: [{ g: 0, a: 0 }, { g: 0, a: 0 }, { g: 1, a: 1 }, { g: 1, a: 1 }] },
    { name: 'Theodoro', matches: [{ g: 0, a: 0 }, { g: 0, a: 0 }, { g: 0, a: 0 }, { g: 0, a: 0 }] },
    { name: 'Danilo (Pxt)', matches: [{ g: 3, a: 0 }, { g: 0, a: 0 }, { g: 2, a: 1 }, { g: '-', a: '-' }] },
    { name: 'Daniel (Pxt)', matches: [{ g: 0, a: 0 }, { g: 0, a: 0 }, { g: 1, a: 0 }, { g: '-', a: '-' }] },
    { name: 'Jonas (Pxt)', matches: [{ g: 0, a: 0 }, { g: 0, a: 0 }, { g: '-', a: '-' }, { g: '-', a: '-' }] },
    { name: 'Guilherme (Mencalha)', matches: [{ g: 0, a: 0 }, { g: 0, a: 0 }, { g: 0, a: 0 }, { g: 0, a: 0 }] },
    { name: 'Douglas (Mencalha)', matches: [{ g: 0, a: 0 }, { g: 0, a: 0 }, { g: 0, a: 0 }, { g: 0, a: 0 }] },
    { name: 'Berpai', matches: [{ g: '-', a: '-' }, { g: '-', a: '-' }, { g: 1, a: 0 }, { g: '-', a: '-' }] }
  ];

  // Calculate total goals and assists for each player
  const playersData = calculateTotals(rawPlayersData);

  // Get the top 3 players for goals and assists
  const top3Goals = getTop3(playersData, 'totalG');
  const top3Assists = getTop3(playersData, 'totalA');

  // Function to check if player is in top 3 of goals or assists
  const isTop3 = (player: { name: any; }, field: string, top3List: any[]) => {
    return top3List.some((topPlayer: { name: any; }) => topPlayer.name === player.name);
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Jogadores', flex: 1 },
    {
      field: 'totalG',
      headerName: 'Total G',
      type: 'number',
      flex: 0.5,
      align: 'center', // This centers the content of the cell
      headerAlign: 'center', // This centers the header text
      renderCell: (params) => (
        <Box
          sx={{
            fontWeight: isTop3(params.row, 'totalG', top3Goals) ? 'bold' : 'normal',
            color: isTop3(params.row, 'totalG', top3Goals) ? 'green' : 'black',
            backgroundColor: isTop3(params.row, 'totalG', top3Goals) ? '#d4edda' : 'white',
            textAlign: 'center', // Ensure text is centered inside the custom rendered cell
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: 'totalA', headerName: 'Total A', type: 'number', flex: 0.5, align: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            fontWeight: isTop3(params.row, 'totalA', top3Assists) ? 'bold' : 'normal',
            color: isTop3(params.row, 'totalA', top3Assists) ? 'blue' : 'black',
            backgroundColor: isTop3(params.row, 'totalA', top3Assists) ? '#cce5ff' : 'white',
          }}
        >
          {params.value}
        </Box>
      ),
    },
    { field: 'g1', headerName: '10/08 G', type: 'number', flex: 0.3 },
    { field: 'a1', headerName: '10/08 A', type: 'number', flex: 0.3 },
    { field: 'g2', headerName: '24/08 G', type: 'number', flex: 0.3 },
    { field: 'a2', headerName: '24/08 A', type: 'number', flex: 0.3 },
    { field: 'g3', headerName: '07/09 G', type: 'number', flex: 0.3 },
    { field: 'a3', headerName: '07/09 A', type: 'number', flex: 0.3 },
    { field: 'g4', headerName: '21/09 G', type: 'number', flex: 0.3 },
    { field: 'a4', headerName: '21/09 A', type: 'number', flex: 0.3 },
  ];

  // Map the players data to fit DataGrid rows structure
  const rows = playersData.map((player, id) => ({
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
  }));

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      {/* Summary Section */}
      <Typography variant="h4" gutterBottom>
        Data Fut - Deportivo BCC
      </Typography>
      <Box>
        <Typography variant="h6">Top 3 Artilheiros:</Typography>
        {top3Goals.map((player, index) => (
          <Typography key={index}>{index + 1}. {player.name} - {player.totalG} Gols</Typography>
        ))}
      </Box>
      <Box mt={2}>
        <Typography variant="h6">Top 3 Garçons:</Typography>
        {top3Assists.map((player, index) => (
          <Typography key={index}>{index + 1}. {player.name} - {player.totalA} Assistências</Typography>
        ))}
      </Box>

      {/* Player Stats DataGrid */}
      <Box sx={{ width: '70%', margin: '20px auto', height: '500px' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
        />
      </Box>
    </Box>
  );
}

export default App;
