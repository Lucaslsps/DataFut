import { supabase } from "../configs/SupabaseClient";
import { Player } from "../interfaces";

export async function getPlayerData(): Promise<Player[]> {
  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("id, name, rating, user (id, name, email, avatar_url)");

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

    const userFromPlayer = player.user ? (player.user as any) : null;
    return {
      id: player.id,
      name: player.name,
      rating: player.rating,
      matches: playerMatches,
      user: userFromPlayer
        ? {
            id: userFromPlayer.id,
            name: userFromPlayer.name,
            email: userFromPlayer.email,
            avatarUrl: userFromPlayer.avatar_url,
            playerId: player.id,
            playerName: player.name,
            playerRating: player.rating,
          }
        : undefined,
    };
  });

  return rawPlayersData;
}
