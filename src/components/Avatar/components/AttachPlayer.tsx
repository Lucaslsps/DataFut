import { Box, Button, Grid2, Modal, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Player, User } from "../../../interfaces";
import { getPlayerData } from "../../../repository/GetPlayerService";
import {
  attachPlayerToUser,
  unattachPlayerToUser,
} from "../../../services/UserService";
import { useUserContext } from "../../../contexts/UserProvider";

interface AttachPlayerProps {
  isAttachPlayerPropsModalOpen: boolean;
  handleIsAttachPlayerPropsModalClose: () => void;
}

export const AttachPlayer: React.FC<AttachPlayerProps> = ({
  isAttachPlayerPropsModalOpen,
  handleIsAttachPlayerPropsModalClose,
}) => {
  const [players, setPlayers] = useState([] as Player[]);
  const [loadingData, setLoadingData] = useState(true);
  const { user, updatedAttachedPlayer } = useUserContext();

  useEffect(() => {
    updatePlayerList();
  }, []);

  function updatePlayerList() {
    getPlayerData().then((data) => {
      setPlayers(data);
      setLoadingData(false);
    });
  }

  function updateLinkBetweenPlayerAndUser(
    player: Player,
    isTakenByCurrentUser: boolean
  ) {
    if (isTakenByCurrentUser) {
      unattachPlayerToUser(player, user)
        .then((success) => {
          updatedAttachedPlayer(undefined);
          updatePlayerList();
        })
        .catch((error) => {
          console.error(error.message);
        });
      return;
    }

    attachPlayerToUser(player, user)
      .then((success) => {
        updatedAttachedPlayer(player);
        updatePlayerList();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  return loadingData ? (
    <>Carregando...</>
  ) : (
    <Modal
      key={"AttachPlayer"}
      open={isAttachPlayerPropsModalOpen}
      onClose={handleIsAttachPlayerPropsModalClose}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Escolha seu jogador
        </Typography>
        <Box
          sx={{
            maxHeight: 300, // Set the desired height for the scrollable area
            overflowY: "auto", // Enable vertical scrolling
            border: "1px solid #ccc", // Optional: Add a border for visual clarity
            padding: 1,
          }}
        >
          <Grid2 container direction="column">
            {players.map((player, index) => {
              const isAlreadyTaken = Boolean(player.user);
              const isTakenByCurrentUser =
                Boolean(player.user) && player.user?.id === user.id;
              return (
                <Grid2
                  key={index}
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ marginBottom: 1 }}
                >
                  <Typography>{player.name}</Typography>
                  <Button
                    variant="contained"
                    disabled={isAlreadyTaken && !isTakenByCurrentUser}
                    color={isTakenByCurrentUser ? "error" : "primary"}
                    onClick={() =>
                      updateLinkBetweenPlayerAndUser(
                        player,
                        isTakenByCurrentUser
                      )
                    }
                  >
                    {isAlreadyTaken
                      ? isTakenByCurrentUser
                        ? "Cancelar"
                        : "Escolhido"
                      : "Sou eu!"}
                  </Button>
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      </Box>
    </Modal>
  );
};

export default AttachPlayer;
