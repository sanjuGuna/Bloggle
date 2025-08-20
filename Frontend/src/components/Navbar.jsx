import React from "react";
import "../styles/Navbar.css";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
return (
    <nav className="navbar">
    <Link to="/" className="logo-link">
        <h1>Bloggle</h1>
    </Link>
    <ul>
        <li>
        <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
            Home
        </NavLink>
        </li>
        <li>
        <NavLink 
            to="/create" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
            Create
        </NavLink>
        </li>
        <li>
        <NavLink 
            to="/login" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
            Login
        </NavLink>
        </li>
        <li>
            <NavLink 
                to="/profile"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
                Profile
            </NavLink>
        </li>
    </ul>
    </nav>
);
};

export default Navbar;