import React from "react";
import "../styles/SideBar.css";
const SideBar = () => {
    const tags = ["Technology", "Lifestyle", "Travel", "Education", "Health"];

    return (
    <aside className="border p-4 rounded shadow">
        <h3 className="font-bold text-lg mb-2">Trending Tags</h3>
        <ul className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
            <li
            key={index}
            className="bg-gray-200 px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-300"
        >
            #{tag}
        </li>
        ))}
    </ul>
    </aside>
);
};

export default SideBar;
