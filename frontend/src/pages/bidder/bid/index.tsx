import React, { useEffect, useState } from "react";
import "../list_art_toy/list_art_toy.css";
import Navbar from "../../../components/bidder/list_art_toy/navbar";
import { GetCategory, GetArtToyById } from "../../../services/https/seller/arttoy";
import { useParams } from "react-router-dom";
import { ArtToysInterface } from "../../../interfaces/ArtToy";
import { GetAutionById, UpdateAuctionPrice, UpdateAuctionStatus } from "../../../services/https/seller/auction";
import { AuctionInterface } from "../../../interfaces/Auction";
import { CreateBid, GetBidHistoryByAuctionId } from "../../../services/https/bidder/bid";
import { BidsInterface } from "../../../interfaces/Bid";
import { useNavigate } from "react-router-dom";
import { FaComment } from "react-icons/fa";
import ChatModal from "../../../components/chat";
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
    const [timeLeft, setTimeLeft] = useState<string>(""); // Countdown timer state
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [bidAmount, setBidAmount] = useState<number>(0); // Track the bid amount
    const [bids, setBids] = useState<BidsInterface[]>([]);
    const navigate = useNavigate(); // Initialize the navigate function
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    const { id } = useParams<{ id: string }>();
    const handleBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBidAmount(parseFloat(e.target.value) || 0); // Update bid amount on input change
    };

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
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / (1000 * 60)) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft(`${days},${hours},${minutes},${seconds}`);
            } else {
                setTimeLeft("0,0,0,0");

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

    const fetchArtToyDetails = async () => {
        if (!id) return;
        try {
            const response = await GetArtToyById(id);
            setArtToy(response.data);
        } catch (error) {
            console.error("Error fetching Art Toy details:", error);
        }
    };

    const fetchAuctionDetails = async () => {
        if (!id) return;
        try {
            const response = await GetAutionById(id);
            setAuction(response.data);
        } catch (error) {
            console.error("Error fetching Auction details:", error);
        }
    };

    const handlePlaceBid = async () => {
        if (!auction) return;

        const currentPrice = auction.CurrentPrice || 0;
        const increment = auction.BidIncrement || 0;
        const endTime = auction.EndDateTime ? new Date(auction.EndDateTime).getTime() : 0;
        const now = new Date().getTime();

        // Check if the bid is higher than the current price + increment
        if (bidAmount < currentPrice + increment) {
            alert("Your bid must be higher than the current price plus the increment.");
            return;
        }

        // Check if the auction has ended
        if (now > endTime) {
            alert("This auction has already ended.");
            return;
        }

        const bidData: BidsInterface = {
            BidAmount: bidAmount,
            AuctionDetailID: auction.ID,
            BidderID: 1, // Replace with actual bidder ID
        };

        console.log("Bid Data:", bidData);

        try {
            const response = await CreateBid(bidData);
            if (response.status === 201) {
                alert("Bid placed successfully!");

                // Update the auction's current price
                try {
                    const updateResponse = await UpdateAuctionPrice(String(auction.ID), bidAmount);
                    if (updateResponse.status === 200) {
                        console.log("Auction current price updated successfully!");
                    } else {
                        console.warn("Failed to update auction price.");
                    }
                } catch (error) {
                    console.error("An error occurred while updating the auction price:", error);
                }

                // Fetch updated data
                await fetchArtToyDetails();
                await fetchAuctionDetails();
            } else {
                alert("Failed to place bid.");
            }
        } catch (error) {
            alert("An error occurred while placing your bid.");
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchBids = async () => {
            if (!id) return; // Ensure auction is loaded
            try {
                const response = await GetBidHistoryByAuctionId(id); // Fetch the bid history for the auction
                setBids(response.data); // Set the bids data
            } catch (error) {
                console.error("Error fetching bid history:", error);
            }
        };
        fetchBids();
    }, [auction, id]); // Re-run when auction details change

    const handleCategoryClick = (category: CategoryInterface) => {
        setCategoryName(category.Name); // Set the clicked category name
        // Navigate to the home page and pass the selected category as a query parameter
        navigate(`/?category=${category.Name}`);
    };

    // Function to toggle the modal visibility
    const toggleModal = (auctionId?: number) => {
        setIsModalOpen(!isModalOpen);
        // Store the auctionId in case you need to use it later
        if (auctionId) {
            console.log("Auction ID for ChatModal:", auctionId);
        }
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
                                    <button
                                        key={category.ID}
                                        className="tab" // Add active class to the selected category
                                        onClick={() => handleCategoryClick(category)} // Handle category click
                                    >
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

                                <div className="arttoy-full-details">
                                    {/* ArtToy Details */}
                                    <div style={{ borderBottom: "1px solid #989494", paddingBottom: "10px" }}>
                                        <h1>Art Toy Details</h1>
                                        {[
                                            { label: "Brand", value: artToy.Brand },
                                            { label: "Category", value: categoryName },
                                            { label: "Size", value: artToy.Size },
                                            { label: "Material", value: artToy.Material },
                                        ].map(({ label, value }) => (
                                            <div
                                                key={label}
                                                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                            >
                                                <h4>{label}</h4>
                                                <h5>{value}</h5>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Description */}
                                    <div style={{ borderBottom: "1px solid #989494", paddingBottom: "10px" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginTop: "10px",
                                            }}
                                        >
                                            <h1>Description</h1>
                                        </div>
                                        <h5 style={{ wordWrap: "break-word", maxWidth: "500px" }}>{artToy.Description}</h5>
                                    </div>
                                </div>
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
                                <h1 style={{ fontSize: "22px", fontWeight: "500", marginTop: "20px" }}>Time Left</h1>
                                <div className="time_left_details">
                                    <div className="time-box">
                                        <h2>{timeLeft && timeLeft.split(",")[0]}</h2>
                                        <h3>days</h3>
                                    </div>
                                    <div className="time-box">
                                        <h2>{timeLeft && timeLeft.split(",")[1]}</h2>
                                        <h3>hours</h3>
                                    </div>
                                    <div className="time-box">
                                        <h2>{timeLeft && timeLeft.split(",")[2]}</h2>
                                        <h3>minutes</h3>
                                    </div>
                                    <div className="time-box">
                                        <h2>{timeLeft && timeLeft.split(",")[3]}</h2>
                                        <h3>seconds</h3>
                                    </div>
                                </div>
                                <div className="current_bid">
                                    <h1>Current Bid:</h1>
                                    <h2>฿{auction.CurrentPrice?.toLocaleString() || "0"}</h2>
                                </div>
                                <div className="current_bid">
                                    <h1>Bid Increment:</h1>
                                    <h2>฿{auction.BidIncrement?.toLocaleString() || "0"}</h2>
                                </div>

                                <div className="bid-container">
                                    <input
                                        type="number"
                                        value={bidAmount}
                                        placeholder="Enter your bid"
                                        className="bid-input"
                                        onChange={handleBidAmountChange}
                                    />
                                    <button onClick={handlePlaceBid} className="place-bid-btn">
                                        COMMIT
                                    </button>
                                </div>

                                <div className="bid-history">
                                    <h1>Bid History</h1>
                                    {bids.length > 0 ? (
                                        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                            <table style={{ width: "100%", tableLayout: "fixed" }}>
                                                <thead style={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 1 }}>
                                                    <tr>
                                                        <th>Bidder</th>
                                                        <th>Bid Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bids.map((bid) => (
                                                        <tr key={bid.ID}>
                                                            <td>{bid.Bidder?.FirstName || "Unknown Bidder"}</td>
                                                            <td>฿ {bid.BidAmount?.toLocaleString() || "0"}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p>No bids placed yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Floating chat icon */}
            <div className="floating-chat" onClick={() => toggleModal(auction?.ID)}>
                <FaComment size={30} color="#454545" />
            </div>
            // ChatModal Component with auctionId
            {isModalOpen && auction?.ID && <ChatModal onClose={toggleModal} auctionId={auction.ID} />}
        </div>
    );
};

export default BidArtToy;
