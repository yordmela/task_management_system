import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Layout = ({ children, user, notifications, name }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Navbar name= {name} user={user} notifications={notifications} />

        {/* Page Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
