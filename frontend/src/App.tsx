import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateArtToy from "./pages/seller/create_auction";
import ListArtToy from "./pages/bidder/list_art_toy";
import EditArtToy from "./pages/seller/edit_auction";
import BidArtToy from "./pages/bidder/bid";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ListArtToy />} />
                <Route path="seller/listing/addArtToy" element={<CreateArtToy />} />
                <Route path="bidder/listArtToy" element={<ListArtToy />} />
                <Route path="seller/listing/editArtToy/:id" element={<EditArtToy />} />
                <Route path ="bidder/bidArtToy/:id" element={<BidArtToy/>}/>
            </Routes>
        </Router>
    );
};

export default App;
