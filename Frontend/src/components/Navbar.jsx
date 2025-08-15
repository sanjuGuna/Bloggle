import React from "react";

const Navbar = () => {
    return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bloggle</h1>
        <ul className="flex gap-6">
            <li className="hover:underline cursor-pointer">Home</li>
            <li className="hover:underline cursor-pointer">Create</li>
            <li className="hover:underline cursor-pointer">Login</li>
        </ul>
    </nav>
    );
};

export default Navbar;
