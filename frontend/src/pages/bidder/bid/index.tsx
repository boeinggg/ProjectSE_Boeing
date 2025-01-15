import React, { useEffect, useState } from "react";
import "../list_art_toy/list_art_toy.css";
import Navbar from "../../../components/bidder/list_art_toy/navbar";
import { GetCategory, GetArtToyById } from "../../../services/https/seller/arttoy";
import { useParams } from "react-router-dom";
import { ArtToysInterface } from "../../../interfaces/ArtToy";
import { GetAutionById, UpdateAuctionStatus } from "../../../services/https/seller/auction";
import { AuctionInterface } from "../../../interfaces/Auction";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";

interface CategoryInterface {
    ID: number;
    Name: string;
    isActive?: boolean; // Make isActive optional
}

const BidArtToy: React.FC = () => {
    const [categories, setCategories] = useState<CategoryInterface[] | null>(null);
    const [artToy, setArtToy] = useState<ArtToysInterface | null>(null); // For storing Art Toy details
    const [auction, setAuction] = useState<AuctionInterface | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null); // Store category name here
    const [openDropdown, setOpenDropdown] = useState<{ [key: string]: boolean }>({}); // Track open/close state for each dropdown
    const [timeLeft, setTimeLeft] = useState<string>(""); // Countdown timer state
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await GetCategory();
                const data: CategoryInterface[] = await response.data;
                const allCategory: CategoryInterface = { ID: 0, Name: "All" };
                setCategories([allCategory, ...data]);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchArtToyDetails = async () => {
            if (!id) return;
            try {
                const response = await GetArtToyById(id); // Pass the ID to the API call
                setArtToy(response.data); // Store the fetched Art Toy details
                const category = categories?.find((cat) => cat.ID === response.data.CategoryID);
                setCategoryName(category?.Name || "Unknown Category"); // Set category name
            } catch (error) {
                console.error("Error fetching Art Toy details:", error);
            }
        };
        fetchArtToyDetails();
    }, [id, categories]); // Add `categories` as a dependency to fetch the category name correctly

    useEffect(() => {
        const fetchAuctionDetails = async () => {
            if (!id) return;
            try {
                const response = await GetAutionById(id); // Pass the ID to the API call
                setAuction(response.data); // Store the fetched Auction details
            } catch (error) {
                console.error("Error fetching Auction details:", error);
            }
        };
        fetchAuctionDetails();
    }, [id]);

    useEffect(() => {
        if (!auction?.EndDateTime) return;

        const calculateTimeLeft = () => {
            const endTime = auction.EndDateTime ? new Date(auction.EndDateTime).getTime() : 0;
            const now = new Date().getTime();
            const difference = endTime - now;

            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / (1000 * 60)) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft("Auction Ended");
                // Check if id is defined before calling UpdateAuctionStatus
                if (id) {
                    UpdateAuctionStatus(id, "Closed");
                }
            }
        };

        calculateTimeLeft(); // Initialize immediately
        const interval = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(interval); // Cleanup interval
    }, [auction, id]); // Include id in the dependency array

    // Toggle the open/close state of the dropdown
    const toggleDropdown = (key: string) => {
        setOpenDropdown((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    return (
        <div className="big-screen-bid">
            <div style={{ width: "100%" }}>
                <div className="header_list">
                    <Navbar />
                    <div className="tab_category">
                        <div className="tabs">
                            {categories &&
                                categories.map((category) => (
                                    <button key={category.ID} className={`tab ${category.isActive ? "active" : ""}`}>
                                        {category.Name}
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="bid_arttoy_detail">
                    {artToy && auction && (
                        <div className="bid_arttoy_container">
                            <div className="time_left">
                                <div className="bid_arttoy_image_container">
                                    {artToy.Picture && artToy.Picture.includes(",data:image/jpeg;base64,") ? (
                                        // If there are multiple images, split and show as a slider
                                        <>
                                            <div className="image-slider">
                                                <img
                                                    src={(() => {
                                                        const pictures = artToy.Picture.split(",data:image/jpeg;base64,");
                                                        return `data:image/jpeg;base64,${pictures[currentImageIndex]}`;
                                                    })()}
                                                    alt={artToy.Name}
                                                    className="bid_arttoy_image"
                                                />
                                            </div>
                                            <div className="slider-controls">
                                                <button
                                                    onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0))}
                                                >
                                                    &lt; {/* Left arrow */}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setCurrentImageIndex((prevIndex) => {
                                                            // Ensure artToy.Picture is defined and contains multiple images
                                                            const pictures = artToy.Picture
                                                                ? artToy.Picture.split(",data:image/jpeg;base64,")
                                                                : [];
                                                            return prevIndex < pictures.length - 1 ? prevIndex + 1 : prevIndex;
                                                        })
                                                    }
                                                >
                                                    &gt; {/* Right arrow */}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        // If only one image, display it normally
                                        <img
                                            src={
                                                artToy?.Picture?.startsWith("data:image/jpeg;base64,")
                                                    ? artToy.Picture
                                                    : artToy?.Picture
                                                    ? `data:image/jpeg;base64,${artToy.Picture}`
                                                    : "path/to/default/image.jpg" // Provide a fallback image in case Picture is undefined or empty
                                            }
                                            alt={artToy?.Name || "Art Toy"} // Use a fallback name if artToy.Name is undefined
                                            className="bid_arttoy_image"
                                        />
                                    )}
                                </div>
                                <h1>Time Left</h1>
                                <h2>{timeLeft}</h2>
                            </div>

                            <div className="bid_arttoy_details">
                                <h1>{artToy.Name}</h1>
                                <h3>{artToy.Brand}</h3>
                                <div className="price">
                                    <div className="start_price">
                                        <h4>Starting from</h4>
                                        <h5>฿ {auction.StartPrice?.toLocaleString() || "0"}</h5>
                                    </div>
                                    <div className="high_bid">
                                        <h4>Highest bid</h4>
                                        <h5>฿ {auction.CurrentPrice?.toLocaleString() || "0"}</h5>
                                    </div>
                                </div>
                                <details
                                    className="arttoy-detail-dropdown"
                                    open={openDropdown["detail1"]} // Control dropdown state
                                    onClick={() => toggleDropdown("detail1")}
                                >
                                    <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span>ArtToy detail</span>
                                        {openDropdown["detail1"] ? (
                                            <RiArrowDropUpLine style={{ width: "32px", height: "auto", color: "gray" }} />
                                        ) : (
                                            <RiArrowDropDownLine style={{ width: "32px", height: "auto", color: "gray" }} />
                                        )}
                                    </summary>
                                    {[
                                        { label: "Brand", value: artToy.Brand },
                                        { label: "Category", value: categoryName },
                                        { label: "Size", value: artToy.Size },
                                        { label: "Material", value: artToy.Material },
                                    ].map(({ label, value }) => (
                                        <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <h4>{label}</h4>
                                            <h5>{value}</h5>
                                        </div>
                                    ))}
                                </details>
                                <details
                                    className="arttoy-detail-dropdown"
                                    open={openDropdown["detail2"]} // Control dropdown state
                                    onClick={() => toggleDropdown("detail2")}
                                >
                                    <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span>Description</span>
                                        {openDropdown["detail2"] ? (
                                            <RiArrowDropUpLine style={{ width: "32px", height: "auto", color: "gray" }} />
                                        ) : (
                                            <RiArrowDropDownLine style={{ width: "32px", height: "auto", color: "gray" }} />
                                        )}
                                    </summary>
                                    <h5 style={{ wordWrap: "break-word", maxWidth: "590px" }}>{artToy.Description}</h5>
                                </details>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BidArtToy;
