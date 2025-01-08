import React, { useEffect, useState } from "react";
import "./list_art_toy.css";

import Navbar from "../../../components/bidder/list_art_toy/navbar";
import { GetArtToy, GetCategory } from "../../../services/https/seller/arttoy";
import banner from "../../../assets/green.png";
import upcomming from "../../../assets/next-date.png";
import active from "../../../assets/auction.png";
import close from "../../../assets/box.png";
import { ArtToysInterface } from "../../../interfaces/ArtToy";
import { AuctionInterface } from "../../../interfaces/Auction";
import { GetAuction } from "../../../services/https/seller/auction";
import ActiveIcon from "../../../assets/up.png";
import UpPrice from "../../../assets/up-arrow.png";

interface CategoryInterface {
    ID: number;
    Name: string;
    isActive?: boolean; // Make isActive optional
}

const ListArtToy: React.FC = () => {
    const [categories, setCategories] = useState<CategoryInterface[] | null>(null);
    const [artToys, setArtToys] = useState<ArtToysInterface[]>([]);
    const [auctions, setAUctions] = useState<AuctionInterface[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await GetCategory();
                const data: CategoryInterface[] = await response.data; // Type the response data

                // Add an "All" category before fetched categories
                const allCategory: CategoryInterface = { ID: 0, Name: "All" };
                setCategories([allCategory, ...data]);
            } catch (error) {
                console.error("Error fetching categories:", error);
                // Handle error gracefully (e.g., display an error message to the user)
            }
        };
        fetchCategories();
    }, []);

    const handleTabClick = (category: CategoryInterface) => {
        // Handle tab click logic here
        console.log("Clicked category:", category);
    };

    useEffect(() => {
        const fetchArtToy = async () => {
            try {
                const response = await GetArtToy();
                const data: ArtToysInterface[] = await response.data; // Type the response data

                setArtToys(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                // Handle error gracefully (e.g., display an error message to the user)
            }
        };

        fetchArtToy();
    }, []);

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const response = await GetAuction();
                const data: AuctionInterface[] = await response.data; // Type the response data

                setAUctions(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                // Handle error gracefully (e.g., display an error message to the user)
            }
        };

        fetchAuction();
    }, []);

    return (
        <div className="big-screen-list">
            <div>
                <div className="header_list">
                    <Navbar />
                    <div className="tab_category">
                        <div className="tabs">
                            {categories &&
                                categories.map((category) => (
                                    <button
                                        key={category.ID}
                                        onClick={() => handleTabClick(category)}
                                        className={`tab ${category.isActive ? "active" : ""}`} // Add active class conditionally
                                    >
                                        {category.Name}
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="list_data">
                    <div>
                        <img src={banner} alt="Banner" className="banner" />
                    </div>
                    <div className="status">
                        <span className="status-item ">
                            <div className="status-icon-container status-item-upcoming">
                                <img src={upcomming} alt="Upcoming" className="status-icon" />
                            </div>
                            Upcoming
                        </span>
                        <span className="status-item">
                            <div className="status-icon-container status-item-active">
                                <img src={active} alt="Active" className="status-icon" />
                            </div>
                            Active
                        </span>
                        <span className="status-item">
                            <div className="status-icon-container status-item-close">
                                <img src={close} alt="Close" className="status-icon" />
                            </div>
                            Close
                        </span>
                    </div>
                    <h1>ART TOY</h1>
                    <div className="list">
                        {artToys.map((artToy) => (
                            <div className="card" key={artToy.ID}>
                                <img src={artToy.Picture} alt={artToy.Name} />
                                <h2>{artToy.Name}</h2>
                                <h3>{artToy.Brand}</h3>
                                <h4>
                                    {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status === "active" && (
                                        <img
                                            src={ActiveIcon}
                                            alt="Active Icon"
                                            style={{ width: "16px", height: "16px", verticalAlign: "middle", marginRight: "5px" }}
                                        />
                                    )}
                                    {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status}
                                </h4>

                                <h5>Highest bid</h5>
                                <h6>
                                    ฿ {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.CurrentPrice?.toLocaleString() || "0"}
                                    {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status === "active" && (
                                        <img
                                            src={UpPrice}
                                            alt="Active Icon"
                                            className="active-icon" // ใช้ class สำหรับการกระพริบ
                                            style={{
                                                width: "20px",
                                                height: "auto",
                                                verticalAlign: "middle",
                                                marginLeft: "5px",
                                            }}
                                        />
                                    )}
                                </h6>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListArtToy;
