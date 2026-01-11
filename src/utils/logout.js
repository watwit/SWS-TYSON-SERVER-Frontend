import axios from "./axios";
import { signOut } from "next-auth/react";

export const logout = async (session) => {
  try {
    const refreshToken = session?.user?.refreshToken;

    if (refreshToken) {
      await axios.post("/api/auth/logout", {
        refresh: refreshToken,
      });
    }
  } catch (err) {
    console.error("Logout error:", err?.response?.data || err.message);
    signOut({ redirect: true, callbackUrl: "/" });
  } finally {
    signOut({ redirect: true, callbackUrl: "/" });
  }
};
