import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children, onShowLogin }) => {
  return (
    <div>
      <Navbar onShowLogin={onShowLogin} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
