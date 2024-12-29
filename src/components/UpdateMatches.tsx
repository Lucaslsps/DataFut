// UpdateMatches.tsx
import React, { useEffect, useState } from "react";
import "../css/UpdateMatches.css";
import { supabase } from "../configs/SupabaseClient";
import { Button, Container, Typography } from "@mui/material";

type Match = {
  id: number;
  player_id: number;
  date: string;
  g: number;
  a: number;
  player_name: string;
};

type GroupedMatches = {
  date: string;
  matches: Match[];
};

function UpdateMatches() {
  const [groupedMatches, setGroupedMatches] = useState<GroupedMatches[]>([]);

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from("matches")
      .select("id, player_id, date, g, a, players(name)")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching matches:", error);
    } else {
      // Process and group matches by date
      const matches = data.map((match: any) => ({
        id: match.id,
        player_id: match.player_id,
        date: match.date,
        g: match.g,
        a: match.a,
        player_name: match.players.name,
      }));

      const groupedData = matches.reduce((acc: GroupedMatches[], match) => {
        const date = new Date(match.date).toLocaleDateString("en-GB");
        let group = acc.find((g) => g.date === date);
        if (!group) {
          group = { date, matches: [] };
          acc.push(group);
        }
        group.matches.push(match);
        return acc;
      }, []);

      setGroupedMatches(groupedData);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const updateMatchStats = async (matchId: number, g: number, a: number) => {
    const { data, error } = await supabase
      .from("matches")
      .update({ g, a })
      .eq("id", matchId);

    if (error) {
      console.error("Error updating match:", error);
    } else {
      setGroupedMatches((prev) =>
        prev.map((group) => ({
          ...group,
          matches: group.matches.map((match) =>
            match.id === matchId ? { ...match, g, a } : match
          ),
        }))
      );
    }
  };

  const incrementGoals = (match: Match) => {
    updateMatchStats(match.id, match.g + 1, match.a);
  };

  const decrementGoals = (match: Match) => {
    updateMatchStats(match.id, Math.max(0, match.g - 1), match.a);
  };

  const incrementAssists = (match: Match) => {
    updateMatchStats(match.id, match.g, match.a + 1);
  };

  const decrementAssists = (match: Match) => {
    updateMatchStats(match.id, match.g, Math.max(0, match.a - 1));
  };

  return (
    <Container className="match-list">
      <Typography variant="h2">Partidas</Typography>
      {groupedMatches.map((group) => (
        <Container key={group.date} className="date-group">
          <Typography variant="h3" className="match-date">
            {group.date}
          </Typography>
          <Container className="matches-container">
            {group.matches.map((match) => (
              <Container key={match.id} className="match-card">
                <Typography className="player-name">
                  {match.player_name}
                </Typography>
                <Container className="stat">
                  <Typography>Goals: {match.g}</Typography>
                  <Container className="buttons">
                    <Button
                      variant="contained"
                      style={{ marginBottom: "0.5em" }}
                      onClick={() => incrementGoals(match)}
                    >
                      +
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => decrementGoals(match)}
                    >
                      -
                    </Button>
                  </Container>
                </Container>
                <Container className="stat">
                  <Typography>Assists: {match.a}</Typography>
                  <Container className="buttons">
                    <Button
                      variant="contained"
                      style={{ marginBottom: "0.5em" }}
                      onClick={() => incrementAssists(match)}
                    >
                      +
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => decrementAssists(match)}
                    >
                      -
                    </Button>
                  </Container>
                </Container>
              </Container>
            ))}
          </Container>
        </Container>
      ))}
    </Container>
  );
}

export default UpdateMatches;
