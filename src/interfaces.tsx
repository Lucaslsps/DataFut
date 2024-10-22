// Define the type for the match data
export type Match = {
    date?: string;
    g: number | string;
    a: number | string;
  };
  
  // Define the type for player data
  export type Player = {
    name: string;
    matches: Match[];
  };
  
  export type PlayerStatsChartProps = {
    player: Player;
  };