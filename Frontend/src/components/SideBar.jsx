import React from "react";
import "../styles/SideBar.css";

const SideBar = () => {
    const tags = ["Technology", "Lifestyle", "Travel", "Education", "Health"];

return (
    <aside className="sidebar">
    <h3 className="sidebar-title">Trending Tags</h3>
    <ul className="tag-list">
        {tags.map((tag, index) => (
        <li key={index} className="tag-item">
            {tag}
        </li>
        ))}
    </ul>
    </aside>
);
};

export default SideBar;
