import axios from "../lib/axios"
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const NoteContext = createContext();

export const NoteState= ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all notes
  const fetchAllNotes = async () => {
    try {
      const { data } = await axios.get(`/notes/fetchallnote`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (data.success) {
        setNotes(data.data);
      }
    } catch (err) {
      setError(err.response?.data || "Failed to fetch notes");
      toast.error(err.response?.data || "Failed to fetch notes");
    }
   
  };

  useEffect(() => {
    fetchAllNotes();
  }, []);


  const createNote = async (formData) => {
    try {
      const { data } = await axios.post(`/notes/createnote`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(data)
      if (data.success) {
        setNotes((prevNotes) => [...prevNotes, data.data.findNote]);
        toast.success("Note Added Successfully!");
      }
    } catch (err) {
      setError(err.response?.data || "Failed to create note");
      toast.error(err.response?.data || "Failed to create note");
    }
    
  };


  const updateNote = async (id, formData) => {
    try {
      const { data } = await axios.put(`/notes/updatenote/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (data.success) {
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note._id === id ? data.data : note))
        );
        toast.success("Note Updated!");
      }
    } catch (err) {
      setError(err.response?.data || "Failed to update note");
      toast.error(err.response?.data || "Failed to update note");
    }
  };


  const deleteNote = async (id) => {
    try {
      await axios.delete(`/notes/deletenote/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      toast.success("Note Deleted!");
    } catch (err) {
      setError(err.response?.data || "Failed to delete note");
      toast.error(err.response?.data || "Failed to delete note");
    }
  };

  return (
    <NoteContext.Provider
      value={{ notes,error, createNote, fetchAllNotes, updateNote, deleteNote }}
    >
      {children}
    </NoteContext.Provider>
  );
};

