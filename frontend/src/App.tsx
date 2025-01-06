import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateArtToy from "./pages/seller/create_auction";
import ListArtToy from "./pages/bidder/list_art_toy";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ListArtToy />} />
                <Route path="seller/listing/addArtToy" element={<CreateArtToy />} />
                <Route path="bidder/listArtToy" element={<ListArtToy />} />
            </Routes>
        </Router>
    );
};

export default App;
