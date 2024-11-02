// Define the type for the match data
export type Match = {
  date: string;
  g: number | null;
  a: number | null;
};

// Define the type for player data
export type Player = {
  id?: number;
  name: string;
  rating: number;
  matches: Match[];
};

export type PlayerStatsChartProps = {
  player: Player;
};
