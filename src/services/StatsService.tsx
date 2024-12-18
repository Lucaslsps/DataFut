import { Player } from "../interfaces";

export const calculateTotals = (players: Player[]) => {
  return players.map((player: any) => ({
    ...player,
    totalG: structuredClone(player).matches.reduce(
      (sum: any, match: { g: string }) => sum + (match.g !== "-" ? match.g : 0),
      0
    ),
    totalA: structuredClone(player).matches.reduce(
      (sum: any, match: { a: string }) => sum + (match.a !== "-" ? match.a : 0),
      0
    ),
    totalP:
      structuredClone(player).matches.reduce(
        (sum: any, match: { g: string }) =>
          sum + (match.g !== "-" ? match.g : 0),
        0
      ) +
      structuredClone(player).matches.reduce(
        (sum: any, match: { a: string }) =>
          sum + (match.a !== "-" ? match.a : 0),
        0
      ),
  }));
};

export const getTop3 = (players: any[], field: string) => {
  return [...players].sort((a, b) => b[field] - a[field]).slice(0, 3);
};

// Function to check if player is in top 3 of goals or assists
export const isTop3 = (player: { name: any }, top3List: any[]) => {
  return top3List.some(
    (topPlayer: { name: any }) => topPlayer.name === player.name
  );
};

// Function to determine the rank of a player based on a specified field (goals or assists)
export const getPlayerRank = (playerName: any, topPlayers: any[]) => {
  const rankIndex = topPlayers.findIndex(
    (player: { name: any }) => player.name === playerName
  );

  if (rankIndex === 0) return "🥇"; // 1st place
  if (rankIndex === 1) return "🥈"; // 2nd place
  if (rankIndex === 2) return "🥉"; // 3rd place
  return ""; // Not in the top 3
};

export const getPlayerTags = (players: any[], player: Player) => {
  const total = calculateTotals(players);
  const top3GoalList = getTop3(total, "totalG");
  const top3AssistList = getTop3(total, "totalA");
  const top3PartList = getTop3(total, "totalP");

  const playerTotalStats = total.find(
    (totalPlayer) => totalPlayer.name === player.name
  );

  const tags: Map<string, string> = new Map([
    ["topgoalscorer", getPlayerRank(player.name, top3GoalList)],
    ["topassist", getPlayerRank(player.name, top3AssistList)],
    ["toppart", getPlayerRank(player.name, top3PartList)],
    ["goals", playerTotalStats.totalG],
    ["assists", playerTotalStats.totalA],
    ["parts", playerTotalStats.totalP],
  ]);
  return tags;
};
