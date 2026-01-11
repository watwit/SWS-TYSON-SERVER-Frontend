import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

function AutoLogout() {
  const [lastActive, setLastActive] = useState(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      setLastActive(Date.now());
    };

    // Existing event listeners
    window.addEventListener("load", handleActivity);
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    // Add keyboard event listeners
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("keypress", handleActivity);

    return () => {
      window.removeEventListener("load", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("keypress", handleActivity);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const now = Date.now();
      if (now - lastActive > process.env.NEXT_PUBLIC_INACTIVITY_TIMEOUT) {
        signOut();
      }
    }, process.env.NEXT_PUBLIC_INACTIVITY_TIMEOUT);

    return () => clearTimeout(timer);
  }, [lastActive]);

  return null;
}

export default AutoLogout;
