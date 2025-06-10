import React, { createContext, useContext, useEffect, useState } from "react";
import msGraphService from "../services/ms-graph.service";
import localStorageService from "../services/local-storage.service";

interface AuthContextType {
  isSignedIn: boolean;
  userPrincipal: string | null;
  signIn: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(
    !!localStorageService.getItemFromLocalStorage("msPrincipal")
  );
  const [userPrincipal, setUserPrincipal] = useState<string | null>(
    localStorageService.getItemFromLocalStorage("msPrincipal") || null
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const principal = localStorageService.getItemFromLocalStorage("msPrincipal");
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
      const principal = localStorageService.getItemFromLocalStorage("msPrincipal");
      setIsSignedIn(true);
      setUserPrincipal(principal);
    } catch (err) {
      console.error("Sign in failed:", err);
      throw err;
    }
  };

  const signOut = () => {
    localStorageService.removeItemFromLocalStorage("msPrincipal");
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
