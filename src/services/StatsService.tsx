import { Player, ITag } from "../interfaces";

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
  return rankIndex + 1;
};

export const getPlayerTags = (players: Player[], player: Player) => {
  const total = calculateTotals(players);
  const top3GoalList = getTop3(total, "totalG");
  const top3AssistList = getTop3(total, "totalA");
  const top3PartList = getTop3(total, "totalP");

  const playerTotalStats = total.find((p) => p.name === player.name);

  const tags: Map<string, ITag> = new Map();

  if (!playerTotalStats) return tags;

  const thresholds = [
    { min: 10, max: 25, label: "10+", cssName: "ten-stat" },
    { min: 25, max: 50, label: "25+", cssName: "twentyfive-stat" },
    { min: 50, max: 100, label: "50+", cssName: "fifty-stat" },
  ];

  const assignThresholdTag = (value: number, key: string, metric: string) => {
    const threshold = thresholds.find((t) => value >= t.min && value < t.max);
    if (threshold) {
      tags.set(key, {
        label: `${threshold.label} ${metric}`,
        cssName: threshold.cssName,
      });
    }
  };

  assignThresholdTag(playerTotalStats.totalG, "goalNumber", "Gols");
  assignThresholdTag(playerTotalStats.totalA, "assistNumber", "Assistências");
  assignThresholdTag(playerTotalStats.totalP, "partNumber", "Participações");

  const assignRankTag = (rank: number, key: string, metric: string) => {
    const badges = ["🥇", "🥈", "🥉"];
    const cssClasses = ["special-class", "second-class", "third-class"];
    if (rank >= 1 && rank <= 3) {
      tags.set(key, {
        label: `TOP ${rank} ${metric}`,
        cssName: cssClasses[rank - 1],
        badge: badges[rank - 1],
      });
    }
  };

  assignRankTag(
    getPlayerRank(player.name, top3GoalList),
    "goalScoringRank",
    "Artilheiro"
  );
  assignRankTag(
    getPlayerRank(player.name, top3AssistList),
    "assistRank",
    "Garçom"
  );
  assignRankTag(
    getPlayerRank(player.name, top3PartList),
    "partRank",
    "Participações"
  );

  return tags;
};

export const getAllPlayerTags = (players: Player[]) => {
  return players.map((player) => getPlayerTags(players, player));
};
