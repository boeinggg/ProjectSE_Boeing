import React, { useEffect, useState } from "react";
import "../list_art_toy/list_art_toy.css";
import Navbar from "../../../components/bidder/list_art_toy/navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { GetArtToy, GetCategory } from "../../../services/https/seller/arttoy";
import { ArtToysInterface } from "../../../interfaces/ArtToy";
import { GetAuction } from "../../../services/https/seller/auction";
import { AuctionInterface } from "../../../interfaces/Auction";
import ActiveIcon from "../../../assets/up.png";

interface CategoryInterface {
    ID: number;
    Name: string;
    isActive?: boolean; // Make isActive optional
}

const SearchArtToy: React.FC = () => {
    const [categories, setCategories] = useState<CategoryInterface[] | null>(null);
    const [artToys, setArtToys] = useState<ArtToysInterface[] | null>(null); // Art Toys data
    const [auctions, setAuctions] = useState<AuctionInterface[] | null>(null); // Auctions data
    const location = useLocation();
    const navigate = useNavigate();

    // Query parameter from URL
    const query = new URLSearchParams(location.search).get("query");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const categoryResponse = await GetCategory();
                const categoryData: CategoryInterface[] = await categoryResponse.data;
                const allCategory: CategoryInterface = { ID: 0, Name: "All" };
                setCategories([allCategory, ...categoryData]);

                // Fetch art toys
                const artToyResponse = await GetArtToy();
                const artToyData: ArtToysInterface[] = await artToyResponse.data;
                setArtToys(artToyData);

                // Fetch auctions
                const auctionResponse = await GetAuction();
                const auctionData: AuctionInterface[] = await auctionResponse.data;
                setAuctions(auctionData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleCategoryClick = (category: CategoryInterface) => {
        navigate(`/?category=${category.Name}`);
    };

    const handleCardClick = (artToy: ArtToysInterface) => {
        navigate(`/bidder/bidArtToy/${artToy.ID}`);
    };

    const filteredArtToys =
        query && artToys
            ? artToys.filter(
                  (artToy) =>
                      artToy.Name?.toLowerCase().includes(query.toLowerCase()) || artToy.Brand?.toLowerCase().includes(query.toLowerCase())
              )
            : artToys;

    return (
        <div className="big-screen-list">
            <div style={{ width: "100%" }}>
                <div className="header_list">
                    <Navbar />
                    <div className="tab_category">
                        <div className="tabs">
                            {categories &&
                                categories.map((category) => (
                                    <button key={category.ID} className="tab" onClick={() => handleCategoryClick(category)}>
                                        {category.Name}
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="search-list">
                    <div style={{ backgroundColor: "white", display: "flex", justifyContent: "space-between", alignItems: "center",paddingTop:"12px", paddingBottom:"12px"}}>
                        <h1 style={{ fontSize: "24px", margin: 0 }}>Search '{query}'</h1>
                        <h2 style={{ fontSize: "16px", fontWeight: "400", color: "#454444", marginRight: "100px" }}>
                            {filteredArtToys ? filteredArtToys.length : 0} result
                        </h2>
                    </div>

                    <div style={{ paddingLeft: "100px", paddingRight: "100px", paddingTop: "20px", paddingBottom: "20px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px" }}>
                            {filteredArtToys && filteredArtToys.length > 0 ? (
                                filteredArtToys.map((artToy) => (
                                    <div className="card" key={artToy.ID} onClick={() => handleCardClick(artToy)}>
                                        <div>
                                            {artToy.Picture && (
                                                <img
                                                    src={(() => {
                                                        const pictures = artToy.Picture.split(",data:image/jpeg;base64,");
                                                        return pictures.length > 1
                                                            ? `data:image/jpeg;base64,${pictures[0]}`
                                                            : artToy.Picture.startsWith("data:image/jpeg;base64,")
                                                            ? artToy.Picture
                                                            : `data:image/jpeg;base64,${artToy.Picture}`;
                                                    })()}
                                                    alt={artToy.Name || "Art Toy Image"}
                                                />
                                            )}
                                        </div>
                                        <h2>{artToy.Name ?? "Unknown Name"}</h2>
                                        <h3>{artToy.Brand}</h3>
                                        <h4>
                                            {auctions &&
                                                auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status === "Active" && (
                                                    <img
                                                        src={ActiveIcon}
                                                        alt="Active Icon"
                                                        style={{
                                                            width: "16px",
                                                            height: "16px",
                                                            verticalAlign: "middle",
                                                            display: "inline-block",
                                                        }}
                                                    />
                                                )}
                                            {auctions && auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status}
                                        </h4>
                                        <h5>Highest bid</h5>
                                        <h6>
                                            ฿{" "}
                                            {(auctions &&
                                                auctions
                                                    .find((auction) => auction.ArtToyID === artToy.ID)
                                                    ?.CurrentPrice?.toLocaleString()) ||
                                                "0"}
                                        </h6>
                                    </div>
                                ))
                            ) : (
                                <p>No art toys found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchArtToy;
