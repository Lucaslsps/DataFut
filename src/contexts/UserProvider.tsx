// UserContext.js
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Player, User } from "../interfaces";
import { loginOrCreate } from "../services/UserService";

// Define the type for the context value
interface UserContextType {
  user: User;
  updateUser: (updatedUser: User) => void;
  updatedAttachedPlayer: (player: Player | undefined) => void;
  login: (
    idGoogle: string,
    email: string,
    name: string,
    avatarUrl: string
  ) => void;
  logout: () => void;
}

// Create the context with the defined type
const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const initialUserFromLocalStorage = localStorage.getItem("user");

  const initialUser: User = initialUserFromLocalStorage
    ? JSON.parse(initialUserFromLocalStorage)
    : null;

  const [user, setPlayer] = useState<User>(initialUser);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const updateUser = (updatedUser: User) => {
    setPlayer(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const updatedAttachedPlayer = (player: Player | undefined) => {
    if (!player) {
      updateUser({
        ...user,
        playerId: undefined,
        playerName: undefined,
        playerRating: undefined,
      });
      return;
    }
    updateUser({
      ...user,
      playerId: player.id,
      playerName: player.name,
      playerRating: player.rating,
    });
  };

  const login = (
    idGoogle: string,
    email: string,
    name: string,
    avatarUrl: string
  ) => {
    loginOrCreate(idGoogle, email, name, avatarUrl).then((user: any) => {
      updateUser({
        ...user,
        avatarUrl: user.avatar_url,
        userId: user.user_id,
        playerId: user.playerId,
        playerName: user.playerName,
        playerRating: user.playerRating,
      });
    });
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Create the context value
  const contextValue: UserContextType = {
    user,
    updateUser,
    updatedAttachedPlayer,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
