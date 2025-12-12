import { useState } from "react";
import { FiSearch, FiMenu } from "react-icons/fi";

export default function Header() {
  const [search, setSearch] = useState("");

  return (
    <header className="w-full bg-pink-600 px-4 py-3 flex items-center gap-3">
      {/* Menu Icon */}
      <button className="text-white text-2xl">
        <FiMenu />
      </button>

      {/* Logo */}
      <div className="w-12 h-12 rounded-lg overflow-hidden">
        <img
          src="/your-logo.jpg"
          alt="Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <h1 className="text-white text-xl font-bold flex-1">
        Badhon's World
      </h1>

      {/* Search Box */}
      <div className="hidden sm:flex items-center border-b border-white text-white">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="bg-transparent outline-none text-white placeholder-white px-2 py-1"
        />
        <FiSearch className="text-xl" />
      </div>

      {/* Mobile Search Icon */}
      <div className="sm:hidden text-white text-2xl">
        <FiSearch />
      </div>
    </header>
  );
}