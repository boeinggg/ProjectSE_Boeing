import React from "react";
import "./create_action.css";

import SideBar from "../../../components/seller/sidebar";
import Navbar from "../../../components/seller/navbar";
import ArtToyDetail from "../../../components/seller/arttoy_details";

const CreateAuction: React.FC = () => {
    return (
        <div className="big-screen">
            <div>
                <SideBar />
            </div>
            <div>
                <Navbar />
                <div className="details">
                    <ArtToyDetail />
                </div>
            </div>
        </div>
    );
};

export default CreateAuction;
