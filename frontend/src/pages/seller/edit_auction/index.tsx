import React from "react";
import { useParams } from "react-router-dom"; // Import useParams for getting the id from the URL
import "../create_auction/create_action.css";

import SideBar from "../../../components/seller/sidebar";
import Navbar from "../../../components/seller/navbar";
import EditArtToyDetail from "../../../components/seller/arttoy_details/edit";

const EditAuction: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Extract the 'id' parameter from the URL

    if (!id) {
        return <div>Error: No auction ID provided.</div>;
    }

    return (
        <div className="big-screen">
            <div>
                <SideBar />
            </div>
            <div>
                <Navbar />
                <div className="details">
                    <EditArtToyDetail id={id} /> {/* Pass the required 'id' prop */}
                </div>
            </div>
        </div>
    );
};

export default EditAuction;
