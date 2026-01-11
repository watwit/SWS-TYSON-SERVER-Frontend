import axios from "./axios";
import { getSession, signIn } from "next-auth/react";
import { logout } from "./logout";

export const useRefreshToken = () => {
  const refresh = async () => {
    try {
      const session = await getSession();
      const refreshToken = session?.user?.refreshToken;

      if (!refreshToken) {
        throw new Error("No refresh token available.");
      }

      const res = await axios.post("/api/auth/refresh", { refresh: refreshToken });

      const { accessToken, refreshToken: newRefreshToken } = res.data.data;

      // Update token in session
      await signIn("credentials", {
        redirect: false,
        username: session.user.username,
        password: "",
        accessToken,
        refreshToken: newRefreshToken,
        role: session.user.role,
      });

      return accessToken;

    } catch (error) {
      console.error("Refresh failed:", error);
      const session = await getSession();
      logout(session);
    }
  };

  return refresh;
};
