"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Start with loading true to fetch user data
  const router = useRouter();

  useEffect(() => {
    let isMounted = true; // Safeguard to avoid setting state if unmounted

    const fetchUserProfile = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null; // Ensure we access localStorage only on the client side
      if (token) {
        try {
          const response = await axios.get(`/api/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (isMounted) {
            setUser(response.data?.name ?? null); // Optional chaining for safer access
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
      if (isMounted) {
        setLoading(false); // Set loading false once we know if user is logged in or not
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false; // Cleanup to avoid memory leaks or state updates after unmount
    };
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  const login = async (email: string, password: string) => {
    setLoading(true); // Set loading to true when trying to log in
    try {
      const response = await axios.post(`/api/users/login`, { email, password });
      const accessToken = response.data?.token; // Optional chaining to avoid unexpected issues
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        setUser(response.data?.name ?? null); // Set user after successful login
        router.push("/"); // Redirect to homepage
        setTimeout(() => {handleReload();},1000);
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Let the calling function handle errors
    } finally {
      setLoading(false); // Always stop loading when done
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    router.push("/login"); // Redirect to login after logging out
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};