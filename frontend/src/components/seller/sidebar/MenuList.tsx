import React from "react";

import "./sidebar.css";

import { Menu } from "antd";
import { RiHomeSmile2Line } from "react-icons/ri";
import { MdOutlineSell } from "react-icons/md";
const MenuList: React.FC = () => {
    return (
        <div className="menu-bar">
            <Menu>
                <div>
                    <h2>GENERAL</h2>
                </div>
                <Menu.Item key="overview" icon={<RiHomeSmile2Line />}>
                    Overview
                </Menu.Item>
                <div>
                    <h2>SELLING</h2>
                </div>
                <Menu.Item key="list" icon={<MdOutlineSell />}>
                    Listing
                </Menu.Item>
            </Menu>
        </div>
    );
};

export default MenuList;
