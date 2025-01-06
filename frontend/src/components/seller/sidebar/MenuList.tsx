import React from "react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";

import { Menu } from "antd";
import { RiHomeSmile2Line } from "react-icons/ri";
import { MdOutlineSell } from "react-icons/md";

const MenuList: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="menu-bar">
            <Menu>
                <div>
                    <h2>GENERAL</h2>
                </div>
                <Menu.Item key="overview" icon={<RiHomeSmile2Line />} onClick={() => navigate("/overview")}>
                    Overview
                </Menu.Item>
                <div>
                    <h2>SELLING</h2>
                </div>
                <Menu.Item key="list" icon={<MdOutlineSell />} onClick={() => navigate("/seller/listing")}>
                    Listing
                </Menu.Item>
            </Menu>
        </div>
    );
};

export default MenuList;
