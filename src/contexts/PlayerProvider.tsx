import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { Player } from "../interfaces";
import { getPlayerData } from "../services/repository/GetPlayerService";

// Define the initial state type
interface PlayerState {
  players: Player[];
}

// Define action types
type Action =
  | { type: "ADD_PLAYER"; payload: Player }
  | { type: "SET_PLAYERS"; payload: Player[] }
  | { type: "UPDATE_PLAYER"; payload: Player }
  | {
      type: "INCREMENT_GOALS";
      payload: { playerId: number; matchIndex: number };
    }
  | {
      type: "DECREMENT_GOALS";
      payload: { playerId: number; matchIndex: number };
    }
  | {
      type: "INCREMENT_ASSISTS";
      payload: { playerId: number; matchIndex: number };
    }
  | {
      type: "DECREMENT_ASSISTS";
      payload: { playerId: number; matchIndex: number };
    };

// Create a context
const PlayerContext = createContext<
  { state: PlayerState; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

// Initial state
const initialState: PlayerState = {
  players: [],
};

// Helper function to save players to localStorage
const saveToLocalStorage = (players: Player[]) => {
  localStorage.setItem("players", JSON.stringify(players));
};

// Helper function to load players from localStorage
const loadFromLocalStorage = (): Player[] => {
  const data = localStorage.getItem("players");
  return data ? JSON.parse(data) : [];
};

// Reducer function
const playerReducer = (state: PlayerState, action: Action): PlayerState => {
  let updatedPlayers;
  switch (action.type) {
    case "ADD_PLAYER":
      updatedPlayers = [...state.players, action.payload];
      saveToLocalStorage(updatedPlayers);
      return { ...state, players: updatedPlayers };

    case "SET_PLAYERS":
      updatedPlayers = action.payload;
      saveToLocalStorage(updatedPlayers);
      return { ...state, players: updatedPlayers };

    case "UPDATE_PLAYER":
      updatedPlayers = state.players.map((player) =>
        player.id === action.payload.id ? action.payload : player
      );
      saveToLocalStorage(updatedPlayers);
      return { ...state, players: updatedPlayers };

    case "INCREMENT_GOALS":
      updatedPlayers = state.players.map((player) =>
        player.id === action.payload.playerId
          ? {
              ...player,
              matches: player.matches.map((match, index) =>
                index === action.payload.matchIndex
                  ? { ...match, g: (match.g || 0) + 1 }
                  : match
              ),
            }
          : player
      );
      saveToLocalStorage(updatedPlayers);
      return { ...state, players: updatedPlayers };

    case "DECREMENT_GOALS":
      updatedPlayers = state.players.map((player) =>
        player.id === action.payload.playerId
          ? {
              ...player,
              matches: player.matches.map((match, index) =>
                index === action.payload.matchIndex
                  ? { ...match, g: Math.max((match.g || 0) - 1, 0) }
                  : match
              ),
            }
          : player
      );
      saveToLocalStorage(updatedPlayers);
      return { ...state, players: updatedPlayers };

    case "INCREMENT_ASSISTS":
      updatedPlayers = state.players.map((player) =>
        player.id === action.payload.playerId
          ? {
              ...player,
              matches: player.matches.map((match, index) =>
                index === action.payload.matchIndex
                  ? { ...match, a: (match.a || 0) + 1 }
                  : match
              ),
            }
          : player
      );
      saveToLocalStorage(updatedPlayers);
      return { ...state, players: updatedPlayers };

    case "DECREMENT_ASSISTS":
      updatedPlayers = state.players.map((player) =>
        player.id === action.payload.playerId
          ? {
              ...player,
              matches: player.matches.map((match, index) =>
                index === action.payload.matchIndex
                  ? { ...match, a: Math.max((match.a || 0) - 1, 0) }
                  : match
              ),
            }
          : player
      );
      saveToLocalStorage(updatedPlayers);
      return { ...state, players: updatedPlayers };

    default:
      return state;
  }
};

// Provider component
export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  // Load initial players from cache, if available
  const cachedPlayers = loadFromLocalStorage();
  const [state, dispatch] = useReducer(playerReducer, {
    ...initialState,
    players: cachedPlayers.length ? cachedPlayers : initialState.players,
  });

  // On first render, fetch data if no cache and set players
  useEffect(() => {
    if (!cachedPlayers.length) {
      const fetchAndCachePlayers = async () => {
        const players = await getPlayerData();
        dispatch({ type: "SET_PLAYERS", payload: players });
      };
      fetchAndCachePlayers();
    }
  }, []);

  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerContext.Provider>
  );
};

// Custom hook to use the PlayerContext
export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
};

// Functions to manage players
export const addPlayer = (dispatch: React.Dispatch<Action>, player: Player) => {
  dispatch({ type: "ADD_PLAYER", payload: player });
};

export const setPlayers = (
  dispatch: React.Dispatch<Action>,
  players: Player[]
) => {
  dispatch({ type: "SET_PLAYERS", payload: players });
};

export const updatePlayer = (
  dispatch: React.Dispatch<Action>,
  player: Player
) => {
  dispatch({ type: "UPDATE_PLAYER", payload: player });
};

export const incrementGoals = (
  dispatch: React.Dispatch<Action>,
  playerId: number,
  matchIndex: number
) => {
  dispatch({ type: "INCREMENT_GOALS", payload: { playerId, matchIndex } });
};

export const decrementGoals = (
  dispatch: React.Dispatch<Action>,
  playerId: number,
  matchIndex: number
) => {
  dispatch({ type: "DECREMENT_GOALS", payload: { playerId, matchIndex } });
};

export const incrementAssists = (
  dispatch: React.Dispatch<Action>,
  playerId: number,
  matchIndex: number
) => {
  dispatch({ type: "INCREMENT_ASSISTS", payload: { playerId, matchIndex } });
};

export const decrementAssists = (
  dispatch: React.Dispatch<Action>,
  playerId: number,
  matchIndex: number
) => {
  dispatch({ type: "DECREMENT_ASSISTS", payload: { playerId, matchIndex } });
};

// Function to retrieve all players
export const getAllPlayers = (state: PlayerState): Promise<Player[]> => {
  return getPlayerData();
};

// Function to retrieve one player by ID or name
export const getPlayerByIdOrName = (
  state: PlayerState,
  identifier: string | number
): Player | undefined => {
  return state.players.find(
    (player) => player.id === identifier || player.name === identifier
  );
};
