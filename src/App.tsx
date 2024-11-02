import React, { useState } from "react";
import DrawTeams from "./DrawTeams";
import PlayerStats from "./PlayersStats";
import { Button, Box, Typography } from "@mui/material";
import UpdateMatches from "./UpdateMatches";

function App() {
  // State to manage which component to display
  const [selectedComponent, setSelectedComponent] = useState<
    "PlayerStats" | "DrawTeams" | "UpdateMatches"
  >("PlayerStats");

  return (
    <div style={{ paddingTop: 10 }}>
      {/* Header with options to select a component */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Button
          variant={
            selectedComponent === "PlayerStats" ? "contained" : "outlined"
          }
          onClick={() => setSelectedComponent("PlayerStats")}
          sx={{ mr: 2 }}
        >
          Estatíticas
        </Button>
        <Button
          variant={selectedComponent === "DrawTeams" ? "contained" : "outlined"}
          onClick={() => setSelectedComponent("DrawTeams")}
        >
          Sorteio
        </Button>
        <Button
          variant={
            selectedComponent === "UpdateMatches" ? "contained" : "outlined"
          }
          onClick={() => setSelectedComponent("UpdateMatches")}
        >
          Partidas
        </Button>
      </Box>

      {/* Conditionally render the selected component */}
      <Box sx={{ textAlign: "center" }}>
        {selectedComponent === "PlayerStats" ? (
          <>
            <PlayerStats />
          </>
        ) : selectedComponent === "DrawTeams" ? (
          <>
            <DrawTeams />
          </>
        ) : (
          <>
            <UpdateMatches></UpdateMatches>
          </>
        )}
      </Box>
    </div>
  );
}

export default App;
