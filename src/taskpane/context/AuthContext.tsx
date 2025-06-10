import React, { createContext, useContext, useEffect, useState } from "react";
import msGraphService from "../services/ms-graph.service";

interface AuthContextType {
  isSignedIn: boolean;
  userPrincipal: string | null;
  signIn: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(!!localStorage.getItem("msPrincipal"));
  const [userPrincipal, setUserPrincipal] = useState<string | null>(
    localStorage.getItem("msPrincipal")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const principal = localStorage.getItem("msPrincipal");
      setIsSignedIn(!!principal);
      setUserPrincipal(principal);
    };

    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Check periodically (optional, if you need real-time updates across tabs)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const signIn = async () => {
    try {
      await msGraphService.loginWithMsGraph();
      const principal = localStorage.getItem("msPrincipal");
      setIsSignedIn(true);
      setUserPrincipal(principal);
    } catch (err) {
      console.error("Sign in failed:", err);
      throw err;
    }
  };

  const signOut = () => {
    localStorage.removeItem("msPrincipal");
    setIsSignedIn(false);
    setUserPrincipal(null);
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, userPrincipal, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
