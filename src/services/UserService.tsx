import { supabase } from "../configs/SupabaseClient";
import { Player, User } from "../interfaces";

export const handleGoogleSignIn = async (response: any, login: any) => {
  try {
    const { credential } = response;
    const decodedToken = JSON.parse(atob(credential.split(".")[1])); // Decode JWT
    const { sub: id, email, name, picture: avatarUrl } = decodedToken;
    login(id, email, name, avatarUrl);
  } catch (error) {
    console.error("Error decoding token:", error);
  }
};

export async function loginOrCreate(
  idGoogle: string,
  email: string,
  name: string,
  avatarUrl: string
) {
  const { data: user, error: selectFromUserError } = await supabase
    .from("user")
    .select(
      `
    *,
    players(*)
  `
    )
    .eq("id_google", idGoogle)
    .eq("email", email);

  if (selectFromUserError) {
    throw new Error(`Error fetching user: ${selectFromUserError.message}`);
  }

  if (!user || user.length === 0) {
    const { data: newUser, error: insertUserError } = await supabase
      .from("user")
      .insert({ id_google: idGoogle, email, name, avatar_url: avatarUrl })
      .select("*") // To return the newly created user
      .single();

    if (insertUserError) {
      throw new Error(`Error creating user: ${insertUserError.message}`);
    }
    return { ...newUser };
  }

  const playerFromUser = user[0].players[0];
  return {
    ...user[0],
    playerId: playerFromUser?.id,
    playerName: playerFromUser?.name,
    playerRating: playerFromUser?.rating,
  }; // Assuming you only want to return a single user
}

export async function attachPlayerToUser(player: Player, user: User) {
  console.log(user.playerId);
  if (user.playerId != null) {
    alert("Você já tem um jogador vinculado!");
    throw new Error("Você já tem um jogador vinculado!");
  }

  if (player.user) {
    alert("Esse jogador já está vinculado a alguém!");
    throw new Error("Esse jogador já está vinculado a alguém!");
  }
  await supabase
    .from("players")
    .update({ user_id: user.id })
    .eq("id", player.id);
}

export async function unattachPlayerToUser(player: Player, user: User) {
  const isTakenByCurrentUser =
    Boolean(player.user) && player.user?.id === user.id;

  if (!isTakenByCurrentUser) {
    alert("Você não pode desvincular o jogador de outra pessoa!");
    throw new Error("Você não pode desvincular o jogador de outra pessoa!");
  }

  await supabase.from("players").update({ user_id: null }).eq("id", player.id);
}
