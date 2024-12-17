import { supabase } from "../../configs/SupabaseClient";
import { Player } from "../../interfaces";

export async function getPlayerData(): Promise<Player[]> {
  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("id, name, rating");

  if (playersError) {
    console.error(playersError);
    return [];
  }

  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select("player_id, date, g, a");

  if (matchesError) {
    console.error(matchesError);
    return [];
  }

  const rawPlayersData = players.map((player) => {
    const playerMatches = matches
      .filter((match) => match.player_id === player.id)
      .map((match) => ({
        date: new Date(match.date).toLocaleDateString("en-GB"),
        g: match.g,
        a: match.a,
      }));

    return {
      name: player.name,
      rating: player.rating,
      matches: playerMatches,
    };
  });

  return rawPlayersData;
}
