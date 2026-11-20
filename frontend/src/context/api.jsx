import axios from "axios";
import { createContext, useContext, useState } from "react";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/feed");
      console.log("Fetched users:", data);
      setProfiles(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchMatches = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/matches");
  
      setMatches(data ? data :[]);
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    }
  };

  const value = {
    fetchUsers,
    profiles,
    setProfiles,
    matches,
    setMatches,
    fetchMatches,
  };
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
