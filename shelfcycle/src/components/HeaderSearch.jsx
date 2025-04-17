import { useState, useEffect, useRef } from "react";
import { FcSearch } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import SummaryAPI from "../common";

const HeaderSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        fetch(`${SummaryAPI.getBooks.url}?search=${encodeURIComponent(query)}`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setSuggestions(data.data.slice(0, 5));
              setShowDropdown(true);
            } else {
              setSuggestions([]);
              setShowDropdown(false);
            }
          })
          .catch(() => {
            setSuggestions([]);
            setShowDropdown(false);
          });
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (book) => {
    navigate(`/search?search=${encodeURIComponent(book.bookTitle)}`);
    setQuery("");
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?search=${encodeURIComponent(query)}`);
      setShowDropdown(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-[300px] hidden lg:flex" ref={dropdownRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books"
        className="flex-1 border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-400 px-3 py-1 rounded-full shadow-sm focus:outline-none text-sm transition-colors"
      />
      <button type="submit" className="absolute right-3 top-1.5">
        <FcSearch size={20} />
      </button>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-10 left-0 w-full bg-white dark:bg-gray-800 border dark:border-gray-600 rounded shadow z-50">
          {suggestions.map((book) => (
            <div
              key={book._id}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 truncate transition-colors"
              onClick={() => handleSelect(book)}
            >
              {book.bookTitle}
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default HeaderSearch;
