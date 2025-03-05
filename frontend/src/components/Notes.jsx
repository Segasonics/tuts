import { useEffect, useState, useContext } from "react";
import { NoteContext } from "../context/NoteState";
import { FiEdit, FiTrash2, FiPlusCircle, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Notes = () => {
  const { notes, loading, error, fetchAllNotes, createNote, updateNote, deleteNote } =useContext(NoteContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: "", title: "", description: "" });

  useEffect(() => {
    fetchAllNotes();
  }, []);

  const handleCreate = () => {
    const newNote = new FormData();
    newNote.append("title", "New Note");
    newNote.append("description", "This is a new note.");
    createNote(newNote);
  };

  const handleDelete = (id) => {
    deleteNote(id);
  };

  const openModal = (note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedNote = new FormData();
    updatedNote.append("title", currentNote.title);
    updatedNote.append("description", currentNote.description);
    updateNote(currentNote._id, updatedNote);
    setIsModalOpen(false);
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 w-full max-w-5xl">
        {notes.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">No notes available.</p>
        ) : (
          notes.map((note) => (
            <motion.div
              key={note._id || note.id || Math.random()}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold text-purple-600">{note.title}</h3>
              <p className="text-gray-700 mt-2">{note.description}</p>
              <div className="flex justify-end gap-3 mt-4">
                <motion.button
                  className="text-blue-600 hover:text-blue-800 transition"
                  whileHover={{ scale: 1.2 }}
                  onClick={() => openModal(note)}
                >
                  <FiEdit size={22} />
                </motion.button>
                <motion.button
                  className="text-red-600 hover:text-red-800 transition"
                  whileHover={{ scale: 1.2 }}
                  onClick={() => handleDelete(note._id)}
                >
                  <FiTrash2 size={22} />
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Update Note Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-purple-600">Update Note</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <FiX size={22} />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="mt-4 space-y-4">
                <div>
                  <label className="block text-gray-600 font-medium">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={currentNote.title}
                    onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                    className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    value={currentNote.description}
                    onChange={(e) =>
                      setCurrentNote({ ...currentNote, description: e.target.value })
                    }
                    className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Update Note
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notes;
