import React, { useEffect, useState } from "react";
import "./list_art_toy.css";

import Navbar from "../../../components/bidder/list_art_toy/navbar";
import { GetCategory } from "../../../services/https/seller/arttoy";
import banner from "../../../assets/green.png";
import upcomming from "../../../assets/next-date.png";
import active from "../../../assets/auction.png";
import close from "../../../assets/box.png";

interface CategoryInterface {
    ID: number;
    Name: string;
    isActive?: boolean; // Make isActive optional
}

const ListArtToy: React.FC = () => {
    const [categories, setCategories] = useState<CategoryInterface[] | null>(null);

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

    return (
        <div className="big-screen">
            <div>
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
                <div>fffff</div>
            </div>
        </div>
    );
};

export default ListArtToy;
