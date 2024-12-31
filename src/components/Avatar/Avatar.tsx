import { Paper, Avatar, Typography, Container, Button } from "@mui/material";
import { useUserContext } from "../../contexts/UserProvider";
import AttachPlayer from "./components/AttachPlayer";
import { useState } from "react";

const Header = () => {
  const { user, logout } = useUserContext();
  const [isAttachPlayerPropsModalOpen, setIsAttachPlayerPropsModalOpen] =
    useState(false);
  const handleIsAttachPlayerPropsModalClose = () =>
    setIsAttachPlayerPropsModalOpen(false);

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "row",
          padding: "10px",
          margin: "10px",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar
          src={user?.avatarUrl}
          alt="User Avatar"
          sx={{ width: 50, height: 50, margin: "auto", marginRight: "1em" }}
        />
        <Typography variant="h6" gutterBottom sx={{ marginRight: "1em" }}>
          {user?.name}
        </Typography>
        <Button
          onClick={() => setIsAttachPlayerPropsModalOpen(true)}
          variant="contained"
          color="primary"
          sx={{ marginRight: "1em" }}
        >
          Escolher Jogador
        </Button>
        <AttachPlayer
          isAttachPlayerPropsModalOpen={isAttachPlayerPropsModalOpen}
          handleIsAttachPlayerPropsModalClose={
            handleIsAttachPlayerPropsModalClose
          }
        />
        <Button onClick={logout} variant="contained" color="secondary">
          Sair
        </Button>
      </Paper>
    </Container>
  );
};

export default Header;
