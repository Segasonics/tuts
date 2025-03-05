import { createContext, useState, useEffect } from "react";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in
  const checkAuthStatus = async () => {
    try {
      const { data } = await axios.get(`/users/me`, {
        withCredentials: true, 
      });
      console.log(data.data)
      setUser(data.data);
    } catch (error) {
      setUser(null); 
    }
    setLoading(false); 
  };

  

  const login = async (formData) => {
    try {
      const { data } = await axios.post(`/users/login`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(data.data)
      setUser(data.data); 
      navigate("/"); 
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(error.message)
    }
  };
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const signup = async (formData) => {
    try {
      const { data } = await axios.post(`/users/register`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setUser(data.user); 
      navigate("/login"); 
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`/users/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
    setUser(null);
    setLoading(false);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout,signup }}>
      {children} 
    </AuthContext.Provider>
  );
};
