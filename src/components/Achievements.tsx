import { useState, useEffect } from "react";
import { ITag, Player } from "../interfaces";
import { getPlayerData } from "../repository/GetPlayerService";
import {
  Avatar,
  Chip,
  Container,
  Divider,
  Grid,
  Grid2,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { getAllPlayerTags } from "../services/StatsService";

const Achievements = () => {
  const [players, setPlayers] = useState([] as Player[]);
  const [loadingData, setLoadingData] = useState(true);
  const [tagSummary, setTagSummary] = useState<
    {
      tag: string;
      playerNames: { name: string; avatarUrl?: string }[];
      count: number;
      percentage: number;
    }[]
  >([]);

  useEffect(() => {
    getPlayerData().then((data) => {
      setPlayers(data);
      setLoadingData(false);
      const allPlayerTags = getAllPlayerTags(data);

      // Process tags into summary data based on the label
      const labelMap: Map<string, string[]> = new Map();

      allPlayerTags.forEach((playerTags, index) => {
        playerTags.forEach((value, _) => {
          const label = value.label; // Use the label as the key
          if (!labelMap.has(label)) {
            labelMap.set(label, []);
          }
          labelMap.get(label)?.push(data[index].name);
        });
      });

      // Create summary for each label
      const summary = Array.from(labelMap.entries())
        .map(([label, names]) => {
          const uniqueNames = [...new Set(names)].sort(); // Ensure alphabetical order
          return {
            tag: label, // Use the label as the tag
            playerNames: uniqueNames.map((name) => ({
              name,
              avatarUrl: data.find((player) => player.name === name)?.user
                ?.avatarUrl,
            })),
            count: uniqueNames.length,
            percentage: parseFloat(
              ((uniqueNames.length / data.length) * 100).toFixed(2)
            ),
          };
        })
        .sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending

      setTagSummary(summary);
    });
  }, []);
  return loadingData ? (
    <>Carregando...</>
  ) : (
    <Container>
      <Grid2
        container
        spacing={3}
        display={"flex"}
        justifyContent={"space-between"}
      >
        {tagSummary.map((summary) => (
          <Grid item xs={12} sm={6} md={4} key={summary.tag}>
            <Paper elevation={3} style={{ padding: "16px" }}>
              <Typography variant="h5" gutterBottom>
                {summary.tag}
              </Typography>
              <Typography variant="h6" gutterBottom>
                ({summary.count} jogadores) ({summary.percentage}
                %)
              </Typography>
              <Divider>
                <Chip label="Jogadores" size="small" />
              </Divider>
              <List>
                {summary.playerNames.map((name) => (
                  <ListItem key={name.name} sx={{ width: "50%" }}>
                    <ListItem>
                      <Avatar src={name.avatarUrl} alt="User Avatar" />
                    </ListItem>
                    <ListItemText primary={name.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid2>
    </Container>
  );
};

export default Achievements;
