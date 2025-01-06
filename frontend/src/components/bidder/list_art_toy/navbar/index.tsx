import React, { useState } from "react";
import { Dropdown, Space, Input } from "antd";
import type { MenuProps } from "antd";
import { CiUser } from "react-icons/ci";
import { FaCircleUser } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import "./listToy_navbar.css"; // เพิ่มไฟล์ CSS
import icon from "../../../../assets/logo.gif";
import { SearchOutlined } from "@ant-design/icons";

const items: MenuProps["items"] = [
    {
        key: "1",
        label: "My Account",
        disabled: true,
    },
    {
        type: "divider",
    },
    {
        key: "2",
        label: "Account Setting",
        icon: <CiUser style={{ fontSize: "18px" }} />,
    },
    {
        key: "3",
        label: "Logout",
        icon: <IoIosLogOut style={{ fontSize: "18px" }} />,
    },
];

const Navbar: React.FC = () => {
    const [searchText, setSearchText] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };
    return (
        <div className="custom-navbar-list-toy">
            <div className="logo">
                <div className="logo-icon">
                    <img src={icon} alt="Logo" />
                </div>
            </div>
            <div className="search-bar">
                <Input placeholder="Search" prefix={<SearchOutlined />} value={searchText} onChange={handleSearchChange} />
            </div>
            <div className="dropdown">
                <Dropdown menu={{ items }}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <FaCircleUser />
                        </Space>
                    </a>
                </Dropdown>
            </div>
        </div>
    );
};

export default Navbar;
