import React, { useState } from "react";
import DrawTeams from "./DrawTeams";
import PlayerStats from "./PlayersStats";
import { Button, Box, Typography } from "@mui/material";
import UpdateMatches from "./UpdateMatches";

const componentMapping: Record<string, JSX.Element> = {
  PlayerStats: <PlayerStats />,
  DrawTeams: <DrawTeams />,
  UpdateMatches: <UpdateMatches />,
};

interface IMenuOptions {
  id: string;
  description: string;
}

function App() {
  const menuOptions: IMenuOptions[] = [
    { id: "PlayerStats", description: "Estatísticas" },
    { id: "DrawTeams", description: "Sorteio" },
    { id: "UpdateMatches", description: "Partidas" },
  ];
  // State to manage which component to display
  const [selectedComponent, setSelectedComponent] = useState<string>(
    menuOptions[0].id
  );

  return (
    <div style={{ paddingTop: 10 }}>
      {/* Header with options to select a component */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        {menuOptions.map((option) => (
          <Button
            variant={selectedComponent === option.id ? "contained" : "outlined"}
            onClick={() => setSelectedComponent(option.id)}
            sx={{ mr: 2 }}
          >
            {option.description}
          </Button>
        ))}
      </Box>

      {/* Conditionally render the selected component */}
      <Box sx={{ textAlign: "center" }}>
        {componentMapping[selectedComponent] || <UpdateMatches />}
      </Box>
    </div>
  );
}

export default App;
