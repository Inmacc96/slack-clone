"use client";
import { useState } from "react";
import { AuthState } from "../types";
import SignInCard from "./sign-in-card";
import SignUpCard from "./sign-up-card";

const AuthScreen = () => {
  const [authState, setAuthState] = useState<AuthState>("signIn");

  return (
    <div className="h-full flex items-center justify-center bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        {authState === "signIn" ? (
          <SignInCard setAuthState={setAuthState} />
        ) : (
          <SignUpCard setAuthState={setAuthState} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
