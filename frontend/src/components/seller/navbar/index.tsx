import React from "react";
import {Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import { CiUser } from "react-icons/ci";
import { FaCircleUser } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import "./Navbar.css"; // เพิ่มไฟล์ CSS


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
    return (
        <div className="custom-navbar">
            <Dropdown menu={{ items }}>
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        <FaCircleUser />
                    </Space>
                </a>
            </Dropdown>
        </div>
    );
};

export default Navbar;
