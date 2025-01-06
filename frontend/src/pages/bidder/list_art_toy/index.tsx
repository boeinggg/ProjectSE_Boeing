import React from "react";
import "./list_art_toy.css";

import Navbar from "../../../components/bidder/list_art_toy/navbar";


const listArtToy: React.FC = () => {
    return (
        <div className="big-screen">
            <div>
                <Navbar />
                <div className="listing">

                </div>
            </div>
        </div>
    );
};

export default listArtToy;
