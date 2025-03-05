import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { SlNotebook } from "react-icons/sl";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800">
          <SlNotebook />
        </Link>

        {/* Desktop Menu - Only Show Logout When Logged In */}
        {user && (
          <button
            onClick={logout}
            className="hidden md:block px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
          >
            Logout
          </button>
        )}

        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu - Only Show Logout When Logged In */}
      {isOpen && user && (
        <div className="md:hidden bg-white shadow-md p-4 flex flex-col items-center space-y-4">
          <button
            onClick={logout}
            className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
