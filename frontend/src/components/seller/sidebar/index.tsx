import React from "react";
import "./sidebar.css";

import Logo from "./Logo";
import MenuList from "./MenuList";

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <Logo />
            <MenuList />
        </div>
    );
};

export default Sidebar;
