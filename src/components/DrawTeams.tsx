import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Slider,
  TextField,
  Paper,
} from "@mui/material";
import { Player } from "../interfaces";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { getPlayerData } from "../services/repository/GetPlayerService";
import { usePlayerContext } from "../contexts/PlayerProvider";

function DrawTeams() {
  // State to manage selected players
  const [players, setPlayers] = useState([] as Player[]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [numberOfTeams, setNumberOfTeams] = useState(3);
  const [playersPerTeam, setPlayersPerTeam] = useState(6);
  const [maxTeamRating, setMaxTeamRating] = useState(50);
  const [teams, setTeams] = useState<Player[][]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    getPlayerData().then((data) => {
      setPlayers(data);
      setLoadingData(false);
    });
  }, []);

  // Handle player selection
  const togglePlayerSelection = (player: Player) => {
    setSelectedPlayers((prev) =>
      prev.includes(player)
        ? prev.filter((p) => p !== player)
        : [...prev, player]
    );
  };

  // Handle team drawing logic with max retry attempts
  const handleDrawTeams = (maxAttempts = 5, attempt = 1) => {
    const shuffledPlayers = [...selectedPlayers].sort(
      () => Math.random() - 0.5
    ); // Shuffle players
    const teams: Player[][] = Array.from({ length: numberOfTeams }, () => []);

    const teamRatings = Array(numberOfTeams).fill(0); // Array to track total ratings of each team
    const teamSizes = Array(numberOfTeams).fill(0); // Array to track number of players in each team

    // Sort players by rating descending to prioritize distributing high-rated players
    const sortedPlayers = [...shuffledPlayers].sort(
      (a, b) => b.rating - a.rating
    );

    const ratingGroups = sortedPlayers.reduce((acc, player) => {
      acc[player.rating] = acc[player.rating] || [];
      acc[player.rating].push(player);
      return acc;
    }, {} as Record<number, Player[]>);

    // Distribute players from each rating group evenly across teams
    Object.keys(ratingGroups).forEach((rating) => {
      const playersWithSameRating = ratingGroups[parseInt(rating)];

      // Distribute players with the same rating across different teams
      for (let i = 0; i < playersWithSameRating.length; i++) {
        const player = playersWithSameRating[i];

        // Find the team with the fewest players and the lowest total rating
        let bestTeamIndex = -1;
        let minRating = Infinity;
        let minTeamSize = Math.min(...teamSizes);

        for (let j = 0; j < numberOfTeams; j++) {
          const currentTeamRating = teamRatings[j];
          const currentTeamSize = teamSizes[j];

          const canAcceptPlayer =
            currentTeamSize <= minTeamSize + 1 &&
            currentTeamRating + player.rating <= maxTeamRating;

          if (canAcceptPlayer && currentTeamRating < minRating) {
            bestTeamIndex = j;
            minRating = currentTeamRating;
          }
        }

        // Assign the player to the best team found
        if (bestTeamIndex !== -1) {
          teams[bestTeamIndex].push(player);
          teamRatings[bestTeamIndex] += player.rating;
          teamSizes[bestTeamIndex] += 1;
        }
      }
    });

    // Final balance check: team sizes and ratings should be within acceptable limits
    const maxTeamRatingValue = Math.max(...teamRatings);
    const minTeamRatingValue = Math.min(...teamRatings);
    const maxTeamSize = Math.max(...teamSizes);
    const minTeamSize = Math.min(...teamSizes);

    // Ensure the difference in both rating and size is within limits
    if (
      (maxTeamRatingValue - minTeamRatingValue > 3 ||
        maxTeamSize - minTeamSize > 1) &&
      attempt < maxAttempts
    ) {
      console.warn(
        `Teams are imbalanced, retrying team assignment. Attempt ${attempt}/${maxAttempts}`
      );
      handleDrawTeams(maxAttempts, attempt + 1); // Retry the team assignment if imbalance is detected
    } else if (attempt >= maxAttempts) {
      console.warn(
        "Maximum retry attempts reached. Final teams may be imbalanced."
      );
      setTeams(teams); // Finalize teams even if not perfectly balanced
    } else {
      setTeams(teams); // Teams are balanced, set them
    }
  };

  return loadingData ? (
    <>Carregando...</>
  ) : (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Selecione os jogadores a serem sorteados
      </Typography>

      {/* Player Selection */}
      <Box display={"flex"} flexWrap={"wrap"} justifyContent={"center"}>
        {players.map((player) => (
          <Paper
            key={player.name}
            elevation={1} // Lighter shadow effect
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "5px 10px", // Reduced padding for a more compact look
              marginBottom: "5px", // Less space between items
              borderRadius: "8px",
              backgroundColor: selectedPlayers.includes(player)
                ? "#f0f4ff"
                : "#fff",
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "#e6f7ff", // Subtle highlight on hover
              },
            }}
          >
            {/* Player Name and Stars */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", marginRight: "4px" }}
              >
                {player.name}
              </Typography>

              {/* Display stars based on player rating */}
              {[...Array(5)].map((_, index) =>
                index < player.rating ? (
                  <StarIcon
                    key={index}
                    sx={{ fontSize: "18px", color: "#fbc02d" }}
                  /> // Smaller star icons
                ) : (
                  <StarBorderIcon
                    key={index}
                    sx={{ fontSize: "18px", color: "#fbc02d" }}
                  />
                )
              )}
            </Box>

            {/* Checkbox for selecting the player */}
            <Checkbox
              checked={selectedPlayers.includes(player)}
              onChange={() => togglePlayerSelection(player)}
              sx={{
                padding: "0", // Remove padding around the checkbox
                "&.Mui-checked": {
                  color: "#1976d2", // Customize checkbox color when selected
                },
              }}
            />
          </Paper>
        ))}
      </Box>

      {/* Team Settings */}
      <Box sx={{ mt: 3 }}>
        <TextField
          label="Número de times"
          type="number"
          value={numberOfTeams}
          onChange={(e) => setNumberOfTeams(Number(e.target.value))}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Jogadores por time"
          type="number"
          value={playersPerTeam}
          onChange={(e) => setPlayersPerTeam(Number(e.target.value))}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Rating máximo dos times"
          type="number"
          value={maxTeamRating}
          onChange={(e) => setMaxTeamRating(Number(e.target.value))}
        />
      </Box>

      {/* Draw Teams Button */}
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={() => handleDrawTeams(900, 0)}>
          Sortear
        </Button>
      </Box>

      {/* Display Teams */}
      {teams.length > 0 && (
        <Box sx={{ mt: 4 }}>
          {teams.map((team, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="h6">
                Time {index + 1} - Rating:{" "}
                {team.reduce((total, cur) => total + cur.rating, 0)}
              </Typography>
              <ul>
                {team.map((player) => (
                  <li key={player.name}>
                    {player.name} {"⭐".repeat(player.rating)}
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default DrawTeams;
