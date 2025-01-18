import React, { useEffect, useState, useRef } from "react"; // Import useRef
import "./list_art_toy.css";
import { Carousel } from "antd";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";

import Navbar from "../../../components/bidder/list_art_toy/navbar";
import { GetArtToy, GetCategory } from "../../../services/https/seller/arttoy";
import banner from "../../../assets/green.png";
import upcomming from "../../../assets/next-date.png";
import active from "../../../assets/auction.png";
import close from "../../../assets/box.png";
import { ArtToysInterface } from "../../../interfaces/ArtToy";
import { AuctionInterface } from "../../../interfaces/Auction";
import { GetAuction, UpdateAuctionStatus } from "../../../services/https/seller/auction";
import ActiveIcon from "../../../assets/up.png";
import UpPrice from "../../../assets/up-arrow.png";
import { useNavigate, useLocation } from "react-router-dom";

interface CategoryInterface {
    ID: number;
    Name: string;
    isActive?: boolean; // Make isActive optional
}

const ListArtToy: React.FC = () => {
    const [categories, setCategories] = useState<CategoryInterface[] | null>(null);
    const [artToys, setArtToys] = useState<ArtToysInterface[]>([]);
    const [auctions, setAuctions] = useState<AuctionInterface[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const navigate = useNavigate();
    const { search } = useLocation(); // Get query parameters from URL

    const upcomingRef = useRef<HTMLDivElement | null>(null);
    const activeRef = useRef<HTMLDivElement | null>(null);
    const closedRef = useRef<HTMLDivElement | null>(null);

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
                setAuctions(data);
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

    useEffect(() => {
        const params = new URLSearchParams(search);
        const category = params.get("category");
        if (category) {
            setSelectedCategory(category);
        }
    }, [search]);

    useEffect(() => {
        const updateAuctionStatus = () => {
            const now = new Date();

            setAuctions((prevAuctions) =>
                prevAuctions.map((auction) => {
                    const startTime = auction.StartDateTime ? new Date(auction.StartDateTime) : null;
                    const endTime = auction.EndDateTime ? new Date(auction.EndDateTime) : null;

                    let status: string = auction.Status || "Unknown";

                    if (startTime && now < startTime) {
                        status = "Upcoming";
                    } else if (startTime && endTime && now >= startTime && now <= endTime) {
                        status = "Active";
                    } else if (endTime && now > endTime) {
                        status = "Closed";
                    }

                    // Call the API to update the status in the database
                    if (status !== auction.Status && auction.ID !== undefined) {
                        // Ensure auction.ID is defined and cast to string if necessary
                        UpdateAuctionStatus(String(auction.ID), status); // Convert to string
                    }

                    return { ...auction, Status: status };
                })
            );
        };

        // Initial update immediately
        updateAuctionStatus();

        // Set interval to update status every second
        const intervalId = setInterval(updateAuctionStatus, 1000);

        // Cleanup on component unmount
        return () => clearInterval(intervalId);
    }, [auctions]); // Re-run whenever auctions change

    const handleTabClick = (category: CategoryInterface) => {
        setSelectedCategory(category.Name);
    };

    const handleCardClick = (artToy: ArtToysInterface) => {
        navigate(`/bidder/bidArtToy/${artToy.ID}`);
    };

    const filteredArtToys = artToys.filter((artToy) => {
        const auction = auctions.find((a) => a.ArtToyID === artToy.ID);

        if (selectedCategory === "All") {
            return true;
        }

        if (selectedCategory === "Active") {
            return auction?.Status === "Active";
        }

        const category = categories?.find((cat) => cat.Name === selectedCategory);
        return category ? artToy.CategoryID === category.ID : false;
    });

    const handleStatusClick = (status: string) => {
        // Scroll to the corresponding section
        if (status === "Upcoming" && upcomingRef.current) {
            upcomingRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (status === "Active" && activeRef.current) {
            activeRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (status === "Closed" && closedRef.current) {
            closedRef.current.scrollIntoView({ behavior: "smooth" });
        }
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
                                        className={`tab ${selectedCategory === category.Name ? "active" : ""}`}
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
                        <span className="status-item" onClick={() => handleStatusClick("Upcoming")}>
                            <div className="status-icon-container status-item-upcoming">
                                <img src={upcomming} alt="Upcoming" className="status-icon" />
                            </div>
                            Upcoming
                        </span>
                        <span className="status-item" onClick={() => handleStatusClick("Active")}>
                            <div className="status-icon-container status-item-active">
                                <img src={active} alt="Active" className="status-icon" />
                            </div>
                            Active
                        </span>
                        <span className="status-item" onClick={() => handleStatusClick("Closed")}>
                            <div className="status-icon-container status-item-close">
                                <img src={close} alt="Closed" className="status-icon" />
                            </div>
                            Closed
                        </span>
                    </div>
                    <h1>ART TOY</h1>
                    <div className="list">
                        <Carousel
                            arrows={true}
                            prevArrow={<FaCircleChevronLeft />}
                            nextArrow={<FaCircleChevronRight />}
                            infinite={false}
                            draggable={true}
                            dots={false}
                        >
                            {filteredArtToys
                                .sort((a, b) => {
                                    const auctionA = auctions.find((auction) => auction.ArtToyID === a.ID);
                                    const auctionB = auctions.find((auction) => auction.ArtToyID === b.ID);

                                    // Define the status order for sorting
                                    const statusOrder: { [key: string]: number } = {
                                        Active: 1,
                                        Upcoming: 2,
                                        Closed: 3,
                                    };

                                    // Safely get status or default to "Closed" if undefined
                                    const statusA = auctionA?.Status || "Closed"; // Default to "Closed" if status is undefined
                                    const statusB = auctionB?.Status || "Closed"; // Default to "Closed" if status is undefined

                                    // Compare statuses based on the order in statusOrder
                                    return (
                                        (statusOrder[statusA] || statusOrder["Closed"]) - (statusOrder[statusB] || statusOrder["Closed"])
                                    );
                                })

                                .reduce<ArtToysInterface[][]>((acc, artToy, index) => {
                                    const groupIndex = Math.floor(index / 4); // Group 4 cards per slide
                                    if (!acc[groupIndex]) acc[groupIndex] = []; // Create a new group if none exists
                                    acc[groupIndex].push(artToy); // Add the card to the group
                                    return acc;
                                }, [])
                                .map((group, index) => (
                                    <div key={index} className="carousel-slide">
                                        <div className="cards-group">
                                            {group.map((artToy) => (
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
                                                                alt={artToy.Name}
                                                            />
                                                        )}
                                                    </div>
                                                    <h2>{artToy.Name}</h2>
                                                    <h3>{artToy.Brand}</h3>
                                                    <h4>
                                                        {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status ===
                                                            "Active" && (
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
                                                        {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status}
                                                    </h4>
                                                    <h5>Highest bid</h5>
                                                    <h6>
                                                        ฿{" "}
                                                        {auctions
                                                            .find((auction) => auction.ArtToyID === artToy.ID)
                                                            ?.CurrentPrice?.toLocaleString() || "0"}
                                                        {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status ===
                                                            "Active" && (
                                                            <img
                                                                src={UpPrice}
                                                                alt="Active Icon"
                                                                className="active-icon"
                                                                style={{
                                                                    width: "20px",
                                                                    height: "auto",
                                                                    verticalAlign: "middle",
                                                                    marginLeft: "5px",
                                                                    display: "inline-block",
                                                                }}
                                                            />
                                                        )}
                                                    </h6>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </Carousel>
                    </div>
                    <div className="list">
                        {/* Upcoming Auctions */}
                        <Carousel
                            arrows={true}
                            prevArrow={<FaCircleChevronLeft />}
                            nextArrow={<FaCircleChevronRight />}
                            infinite={false}
                            draggable={true}
                            dots={false}
                        >
                            {filteredArtToys
                                .filter((artToy) => {
                                    const auction = auctions.find((auction) => auction.ArtToyID === artToy.ID);
                                    return auction?.Status === "Upcoming";
                                })
                                .reduce<ArtToysInterface[][]>((acc, artToy, index) => {
                                    const groupIndex = Math.floor(index / 4); // Group 4 cards per slide
                                    if (!acc[groupIndex]) acc[groupIndex] = []; // Create a new group if none exists
                                    acc[groupIndex].push(artToy); // Add the card to the group
                                    return acc;
                                }, [])
                                .map((group, groupIndex) => (
                                    <div key={groupIndex} ref={upcomingRef} className="carousel-slide">
                                        <h2>Upcoming</h2>
                                        {group.length === 0 ? (
                                            <h2>No Art Toys Available</h2>
                                        ) : (
                                            <div className="cards-group">
                                                {group.map((artToy) => (
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
                                                                    alt={artToy.Name}
                                                                />
                                                            )}
                                                        </div>
                                                        <h2>{artToy.Name}</h2>
                                                        <h3>{artToy.Brand}</h3>
                                                        <h4>
                                                            {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status ===
                                                                "Active" && (
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
                                                            {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status}
                                                        </h4>
                                                        <h5>Highest bid</h5>
                                                        <h6>
                                                            ฿{" "}
                                                            {auctions
                                                                .find((auction) => auction.ArtToyID === artToy.ID)
                                                                ?.CurrentPrice?.toLocaleString() || "0"}
                                                            {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status ===
                                                                "Active" && (
                                                                <img
                                                                    src={UpPrice}
                                                                    alt="Active Icon"
                                                                    className="active-icon"
                                                                    style={{
                                                                        width: "20px",
                                                                        height: "auto",
                                                                        verticalAlign: "middle",
                                                                        marginLeft: "5px",
                                                                        display: "inline-block",
                                                                    }}
                                                                />
                                                            )}
                                                        </h6>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </Carousel>

                        {/* Active Auctions */}
                        <Carousel
                            arrows={true}
                            prevArrow={<FaCircleChevronLeft />}
                            nextArrow={<FaCircleChevronRight />}
                            infinite={false}
                            draggable={true}
                            dots={false}
                        >
                            {filteredArtToys
                                .filter((artToy) => {
                                    const auction = auctions.find((auction) => auction.ArtToyID === artToy.ID);
                                    return auction?.Status === "Active";
                                })
                                .reduce<ArtToysInterface[][]>((acc, artToy, index) => {
                                    const groupIndex = Math.floor(index / 4); // Group 4 cards per slide
                                    if (!acc[groupIndex]) acc[groupIndex] = []; // Create a new group if none exists
                                    acc[groupIndex].push(artToy); // Add the card to the group
                                    return acc;
                                }, [])
                                .map((group, groupIndex) => (
                                    <div key={groupIndex} ref={activeRef} className="carousel-slide">
                                        <h2>Active</h2>
                                        {group.length === 0 ? (
                                            <p>No Art Toys Available</p>
                                        ) : (
                                            <div className="cards-group">
                                                {group.map((artToy) => (
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
                                                                    alt={artToy.Name}
                                                                />
                                                            )}
                                                        </div>
                                                        <h2>{artToy.Name}</h2>
                                                        <h3>{artToy.Brand}</h3>
                                                        <h4>
                                                            {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status ===
                                                                "Active" && (
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
                                                            {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status}
                                                        </h4>
                                                        <h5>Highest bid</h5>
                                                        <h6>
                                                            ฿{" "}
                                                            {auctions
                                                                .find((auction) => auction.ArtToyID === artToy.ID)
                                                                ?.CurrentPrice?.toLocaleString() || "0"}
                                                            {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status ===
                                                                "Active" && (
                                                                <img
                                                                    src={UpPrice}
                                                                    alt="Active Icon"
                                                                    className="active-icon"
                                                                    style={{
                                                                        width: "20px",
                                                                        height: "auto",
                                                                        verticalAlign: "middle",
                                                                        marginLeft: "5px",
                                                                        display: "inline-block",
                                                                    }}
                                                                />
                                                            )}
                                                        </h6>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </Carousel>

                        {/* Closed Auctions */}
                        <Carousel
                            arrows={true}
                            prevArrow={<FaCircleChevronLeft />}
                            nextArrow={<FaCircleChevronRight />}
                            infinite={false}
                            draggable={true}
                            dots={false}
                        >
                            {filteredArtToys
                                .filter((artToy) => {
                                    const auction = auctions.find((auction) => auction.ArtToyID === artToy.ID);
                                    return auction?.Status === "Closed";
                                })
                                .reduce<ArtToysInterface[][]>((acc, artToy, index) => {
                                    const groupIndex = Math.floor(index / 4); // Group 4 cards per slide
                                    if (!acc[groupIndex]) acc[groupIndex] = []; // Create a new group if none exists
                                    acc[groupIndex].push(artToy); // Add the card to the group
                                    return acc;
                                }, [])
                                .map((group, groupIndex) => (
                                    <div key={groupIndex} ref={closedRef} className="carousel-slide">
                                        <h2>Closed</h2>
                                        {group.length === 0 ? (
                                            <p>No Art Toys Available</p>
                                        ) : (
                                            <div className="cards-group">
                                                {group.map((artToy) => (
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
                                                                    alt={artToy.Name}
                                                                />
                                                            )}
                                                        </div>
                                                        <h2>{artToy.Name}</h2>
                                                        <h3>{artToy.Brand}</h3>
                                                        <h4>
                                                            {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status ===
                                                                "Active" && (
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
                                                            {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status}
                                                        </h4>
                                                        <h5>Highest bid</h5>
                                                        <h6>
                                                            ฿{" "}
                                                            {auctions
                                                                .find((auction) => auction.ArtToyID === artToy.ID)
                                                                ?.CurrentPrice?.toLocaleString() || "0"}
                                                            {auctions.find((auction) => auction.ArtToyID === artToy.ID)?.Status ===
                                                                "Active" && (
                                                                <img
                                                                    src={UpPrice}
                                                                    alt="Active Icon"
                                                                    className="active-icon"
                                                                    style={{
                                                                        width: "20px",
                                                                        height: "auto",
                                                                        verticalAlign: "middle",
                                                                        marginLeft: "5px",
                                                                        display: "inline-block",
                                                                    }}
                                                                />
                                                            )}
                                                        </h6>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListArtToy;
