
import { createContext, useContext, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  
  const handleAuth = (res) => {
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return handleAuth(res);
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/auth/signup", { name, email, password });
    return handleAuth(res);
  };

  
  const googleLogin = async (credential) => {
    const res = await api.post("/auth/google", { credential });
    return handleAuth(res);
  };

  
  const forgotPassword = async (email) => {
    const res = await api.post("/auth/forgot", { email });
    return res.data;
  };

 
  const resetPassword = async (token, password) => {
    const res = await api.post("/auth/reset", { token, password });
    return handleAuth(res);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, googleLogin, forgotPassword, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}