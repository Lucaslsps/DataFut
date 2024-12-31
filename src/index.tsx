import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import { PlayerProvider } from "./contexts/PlayerProvider";
import { UserProvider } from "./contexts/UserProvider";

const root = ReactDOMClient.createRoot(document.getElementById("root")!);

root.render(
  <React.Fragment>
    <UserProvider>
      <PlayerProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <App />
      </PlayerProvider>
    </UserProvider>
  </React.Fragment>
);
