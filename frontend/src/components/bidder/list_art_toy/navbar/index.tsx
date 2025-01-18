import React, { useState } from "react";
import { Dropdown, Space, Input } from "antd";
import type { MenuProps } from "antd";
import { CiUser } from "react-icons/ci";
import { FaCircleUser } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import "./listToy_navbar.css"; // เพิ่มไฟล์ CSS
import icon from "../../../../assets/logo.gif";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleLogoClick = () => {
        navigate("/"); // เปลี่ยนเส้นทางไปยังหน้าหลัก หรือระบุ path ที่ต้องการ
    };

    const handleSearchSubmit = () => {
        if (searchText.trim()) {
            // Navigate to the SearchArtToy page with the searchText as a query parameter
            navigate(`/bidder/searchArtToy?query=${encodeURIComponent(searchText)}`);
        }
    };
    return (
        <div className="custom_navbar_list_toy">
            <div className="logo" onClick={handleLogoClick}>
                <div className="logo-icon">
                    <img src={icon} alt="Logo" />
                </div>
            </div>
            <div className="search-bar">
                <Input
                    placeholder="Search"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={handleSearchChange}
                    onPressEnter={handleSearchSubmit} // Trigger search on Enter key
                />
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
