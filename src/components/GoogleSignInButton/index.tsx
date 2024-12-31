import React from "react";
import "./index.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { handleGoogleSignIn } from "../../services/UserService";
import { useUserContext } from "../../contexts/UserProvider";

const GoogleSignInButton: React.FC = () => {
  const { login } = useUserContext();

  return (
    <GoogleOAuthProvider clientId="1084994495218-s0hj1t7638qjib9iele6q7h2sb74pnp3.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={(response) => handleGoogleSignIn(response, login)}
        onError={() => {
          console.error("Google Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleSignInButton;
