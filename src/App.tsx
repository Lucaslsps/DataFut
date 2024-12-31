import { useState } from "react";
import DrawTeams from "./components/DrawTeams";
import GeneralStats from "./components/GeneralStats";
import PlayersStats from "./components/PlayerStats/PlayersStats";
import { Button, Box, Container } from "@mui/material";
import UpdateMatches from "./components/UpdateMatches";
import { JSX } from "react/jsx-runtime";
import Achievements from "./components/Achievements";
import { useUserContext } from "./contexts/UserProvider";
import GoogleSignInButton from "./components/GoogleSignInButton";
import Avatar from "./components/Avatar/Avatar";

const componentMapping: Record<string, JSX.Element> = {
  GeneralStats: <GeneralStats />,
  PlayersStats: <PlayersStats />,
  DrawTeams: <DrawTeams />,
  UpdateMatches: <UpdateMatches />,
  Achievements: <Achievements />,
};

interface IMenuOptions {
  id: string;
  description: string;
}

function App() {
  const { user } = useUserContext();

  const menuOptions: IMenuOptions[] = [
    { id: "GeneralStats", description: "Estatísticas gerais" },
    { id: "PlayersStats", description: "Estatística de jogador" },
    { id: "DrawTeams", description: "Sorteio" },
    { id: "UpdateMatches", description: "Partidas" },
    { id: "Achievements", description: "Conquistas" },
  ];
  // State to manage which component to display
  const [selectedComponent, setSelectedComponent] = useState<string>(
    menuOptions[0].id
  );

  return (
    <Container style={{ paddingTop: 10 }}>
      {user ? (
        <Avatar></Avatar>
      ) : (
        <Container
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "1em",
          }}
        >
          <GoogleSignInButton />
        </Container>
      )}
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
    </Container>
  );
}

export default App;
