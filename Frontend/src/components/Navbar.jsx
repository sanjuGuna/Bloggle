import React from "react";
import "../styles/Navbar.css";

const Navbar = () => {
return (
    <nav className="navbar">
    <h1>Bloggle</h1>
    <ul>
        <li>Home</li>
        <li>Create</li>
        <li>Login</li>
    </ul>
    </nav>
);
};

export default Navbar;
