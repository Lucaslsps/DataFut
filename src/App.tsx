import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// Helper function to calculate total goals and assists
const calculateTotals = (players: any[]) => {
  return players.map((player: { matches: any[]; }) => ({
    ...player,
    totalG: player.matches.reduce((sum: any, match: { g: string; }) => sum + (match.g !== '-' ? match.g : 0), 0),
    totalA: player.matches.reduce((sum: any, match: { a: string; }) => sum + (match.a !== '-' ? match.a : 0), 0),
  }));
};

const getTop3 = (players: any, field: string) => {
  return [...players].sort((a, b) => b[field] - a[field]).slice(0, 3);
};

  // Function to check if player is in top 3 of goals or assists
  const isTop3 = (player: { name: any; }, field: string, top3List: any[]) => {
    return top3List.some((topPlayer: { name: any; }) => topPlayer.name === player.name);
  };

function App() {
  const rawPlayersData = [     { name: 'Xande', matches: [{ g: 0, a: 0 }, { g: 0, a: 0 }, { g: 2, a: 0 }, { g: 0, a: 0 }] },
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
    { name: 'Berpai', matches: [{ g: '-', a: '-' }, { g: '-', a: '-' }, { g: 1, a: 0 }, { g: '-', a: '-' }] } ];

  const playersData = calculateTotals(rawPlayersData);
  const top3Goals = getTop3(playersData, 'totalG');
  const top3Assists = getTop3(playersData, 'totalA');

  const columns: GridColDef [] = [     
    { field: 'name', headerName: 'Jogadores', flex: 1, minWidth: 50 },
    {
      field: 'totalG',
      headerName: 'Total G',
      type: 'number',
      flex: 0.5,
      align: 'center', // This centers the content of the cell
      headerAlign: 'center', // This centers the header text
      renderCell: (params: any) => (
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
      renderCell: (params: any) => (
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
    { field: 'a4', headerName: '21/09 A', type: 'number', flex: 0.3 }, ];

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
  }));

  return (
    <Box sx={{ width: '100%', textAlign: 'center', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Data Fut - Deportivo BCC
      </Typography>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-around" mt={4}>
        
        {/* Top 3 Artilheiros Podium */}
        <Box>
          <Typography variant="h6" align="center">Top 3 Artilheiros:</Typography>
          <Box display="flex" justifyContent="center" alignItems="flex-end" mt={2}>
            {/* 2nd place */}
            <Box
              width={{ xs: '80%', sm: 100 }}
              height={150}
              bgcolor="silver"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              mx={1}
            >
              <Typography variant="subtitle1" align="center">
                2. {top3Goals[1].name} 🥈<br />{top3Goals[1].totalG} Gols
              </Typography>
            </Box>

            {/* 1st place */}
            <Box
              width={{ xs: '80%', sm: 120 }}
              height={200}
              bgcolor="gold"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              mx={1}
            >
              <Typography variant="subtitle1" align="center">
                1. {top3Goals[0].name} 🥇<br />{top3Goals[0].totalG} Gols
              </Typography>
            </Box>

            {/* 3rd place */}
            <Box
              width={{ xs: '80%', sm: 100 }}
              height={120}
              bgcolor="#cd7f32"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              mx={1}
            >
              <Typography variant="subtitle1" align="center">
                3. {top3Goals[2].name} 🥉<br />{top3Goals[2].totalG} Gols
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Top 3 Garçons Podium */}
        <Box>
          <Typography variant="h6" align="center" mt={{ xs: 2, sm: 0 }}>Top 3 Garçons:</Typography>
          <Box display="flex" justifyContent="center" alignItems="flex-end" mt={2}>
            {/* 2nd place */}
            <Box
              width={{ xs: '80%', sm: 100 }}
              height={150}
              bgcolor="silver"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              mx={1}
            >
              <Typography variant="subtitle1" align="center">
                2. {top3Assists[1].name} 🥈<br />{top3Assists[1].totalA} Assistências
              </Typography>
            </Box>

            {/* 1st place */}
            <Box
              width={{ xs: '80%', sm: 120 }}
              height={200}
              bgcolor="gold"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              mx={1}
            >
              <Typography variant="subtitle1" align="center">
                1. {top3Assists[0].name} 🥇<br />{top3Assists[0].totalA} Assistências
              </Typography>
            </Box>

            {/* 3rd place */}
            <Box
              width={{ xs: '80%', sm: 100 }}
              height={120}
              bgcolor="#cd7f32"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              mx={1}
            >
              <Typography variant="subtitle1" align="center">
                3. {top3Assists[2].name} 🥉<br />{top3Assists[2].totalA} Assistências
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Player Stats DataGrid */}
      <Box sx={{ width: { xs: '100%', sm: '70%' }, margin: '20px auto', height: '500px' }}>
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
