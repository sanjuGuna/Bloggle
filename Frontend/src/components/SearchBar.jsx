import React, { useState } from "react";
import "../styles/SearchBar.css";

const SearchBar = ({ onSearch }) => {
const [query, setQuery] = useState("");

const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
};

return (
    <form onSubmit={handleSearch} className="search-bar">
        <input
        type="text"
        placeholder="Search blogs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
    />
    <button type="submit">Search</button>
    </form>
);
};

export default SearchBar;
