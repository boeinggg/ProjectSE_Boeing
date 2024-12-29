import React from "react";

import "./button.css"

interface ButtonProps {
    label: string;
    variant: "cancel" | "confirm";
    onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, variant, onClick }) => {
    return (
        <button className={`button button--${variant}`} onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;
