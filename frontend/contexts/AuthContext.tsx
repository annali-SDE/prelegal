"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        authModalOpen,
        openAuthModal: () => setAuthModalOpen(true),
        closeAuthModal: () => setAuthModalOpen(false),
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
