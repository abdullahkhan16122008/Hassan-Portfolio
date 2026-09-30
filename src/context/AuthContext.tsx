// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // initial check
  const navigate = useNavigate();

  // Check if user was logged in (simple: localStorage flag)
  useEffect(() => {
    const logged = localStorage.getItem("adminLoggedIn") === "true";
    setIsLoggedIn(logged);
    setIsLoading(false);
  }, []);

  let api = import.meta.env.VITE_API_URL;

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${api}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        setIsLoggedIn(true);
        // localStorage.setItem("adminLoggedIn", "true");
        navigate("/admin");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err: any) {
      alert(err.message || "Login error");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}