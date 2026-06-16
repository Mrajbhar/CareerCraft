import { createContext, useContext, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // load saved user on first render (keeps you logged in after refresh)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // save token + user after a successful login/signup
  const handleAuth = (res) => {
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  // these are the actual API calls for login & signup
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return handleAuth(res);
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/auth/signup", { name, email, password });
    return handleAuth(res);
  };

  // Google Identity Services hands us a credential (ID token); backend verifies it.
  const googleLogin = async (credential) => {
    const res = await api.post("/auth/google", { credential });
    return handleAuth(res);
  };

  // request a reset link (returns { msg, resetToken? } — token only in dev)
  const forgotPassword = async (email) => {
    const res = await api.post("/auth/forgot", { email });
    return res.data;
  };

  // set a new password with the token, then log in
  const resetPassword = async (token, password) => {
    const res = await api.post("/auth/reset", { token, password });
    return handleAuth(res);
  };

  // pull the latest user (plan, AI credits) from the server and cache it
  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data.user;
    } catch {
      return null;
    }
  };

  // replace the cached user (e.g. right after a successful upgrade)
  const setUserData = (u) => {
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isPro: user?.plan === "pro", login, signup, googleLogin, forgotPassword, resetPassword, logout, refreshUser, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
}