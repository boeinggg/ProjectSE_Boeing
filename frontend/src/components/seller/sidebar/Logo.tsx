import React from "react";
import icon from "../../../assets/logo.gif";

import "./sidebar.css";

const Logo: React.FC = () => {
    return (
        <div className="logo">
            <div className="logo-icon">
                <img src={icon} alt="Logo" />
                <div>
                    <h1>BIDTOY PARTNER</h1>
                </div>
            </div>
        </div>
    );
};

export default Logo;
