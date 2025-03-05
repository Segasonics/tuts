import { useState, useContext,useEffect } from "react";
import { NoteContext } from "../context/NoteState";
import toast from "react-hot-toast";

const Form = () => {
  const { createNote,fetchAllNotes } = useContext(NoteContext);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title.trim() === "" || formData.description.trim() === "") {
      toast.error("Both fields are required!");
      return;
    }
    createNote(formData);
    setFormData({ title: "", description: "" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-purple-600">Notepad</h2>
        <p className="text-gray-500 text-center mt-2">Write and save your notes</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter note title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Description</label>
            <textarea
              name="description"
              placeholder="Enter note description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            
          >
            {/* {loading ? "Saving..." : "Save Note"} */}
            Save Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
