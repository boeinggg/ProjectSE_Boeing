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
import { useNavigate } from "react-router-dom";

interface CategoryInterface {
    ID: number;
    Name: string;
    isActive?: boolean; // Make isActive optional
}

const ListArtToy: React.FC = () => {
    const [categories, setCategories] = useState<CategoryInterface[] | null>(null);
    const [artToys, setArtToys] = useState<ArtToysInterface[]>([]);
    const [auctions, setAUctions] = useState<AuctionInterface[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await GetCategory();
                const data: CategoryInterface[] = await response.data;

                // Add an "All" category before fetched categories
                const allCategory: CategoryInterface = { ID: 0, Name: "All" };
                setCategories([allCategory, ...data]);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchArtToy = async () => {
            try {
                const response = await GetArtToy();
                const data: ArtToysInterface[] = await response.data;
                setArtToys(data);
            } catch (error) {
                console.error("Error fetching art toys:", error);
            }
        };

        const fetchAuction = async () => {
            try {
                const response = await GetAuction();
                const data: AuctionInterface[] = await response.data;
                setAUctions(data);
            } catch (error) {
                console.error("Error fetching auctions:", error);
            }
        };

        // Fetch immediately on mount
        fetchCategories();
        fetchArtToy();
        fetchAuction();

        // Fetch all data every 5 seconds
        const intervalId = setInterval(() => {
            fetchCategories();
            fetchArtToy();
            fetchAuction();
        }, 5000);

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);

    const handleTabClick = (category: CategoryInterface) => {
        console.log("Clicked category:", category);
    };

    const handleCardClick = (artToy: ArtToysInterface) => {
        navigate(`/bidder/bidArtToy/${artToy.ID}`);
    };

    return (
        <div className="big-screen-list">
            <div style={{ width: "100%" }}>
                <div className="header_list">
                    <Navbar />
                    <div className="tab_category">
                        <div className="tabs">
                            {categories &&
                                categories.map((category) => (
                                    <button
                                        key={category.ID}
                                        onClick={() => handleTabClick(category)}
                                        className={`tab ${category.isActive ? "active" : ""}`}
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
                            <div className="card" key={artToy.ID} onClick={() => handleCardClick(artToy)}>
                                <div>
                                    {artToy.Picture && (
                                        <img
                                            src={(() => {
                                                // เช็คว่ามีหลายรูปภาพไหม
                                                const pictures = artToy.Picture.split(",data:image/jpeg;base64,");

                                                // ถ้ามีมากกว่าหนึ่งรูป ให้แสดงรูปแรก
                                                if (pictures.length > 1) {
                                                    return `data:image/jpeg;base64,${pictures[0]}`;
                                                }

                                                // ถ้ามีแค่รูปเดียวหรือไม่มีการแยก แสดงรูปนั้นหรือเติม prefix ถ้ายังไม่มี
                                                return artToy.Picture.startsWith("data:image/jpeg;base64,")
                                                    ? artToy.Picture // ถ้ามีแค่รูปเดียวที่เริ่มต้นด้วย "data:image/jpeg;base64,"
                                                    : `data:image/jpeg;base64,${artToy.Picture}`; // ถ้าไม่มี "data:image/jpeg;base64," ให้เติมไป
                                            })()}
                                            alt={artToy.Name}
                                        />
                                    )}
                                </div>

                                <h2>{artToy.Name}</h2>
                                <h3>{artToy.Brand}</h3>
                                <h4>
                                    {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status === "Active" && (
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
                                    {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status === "Active" && (
                                        <img
                                            src={UpPrice}
                                            alt="Active Icon"
                                            className="active-icon"
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
