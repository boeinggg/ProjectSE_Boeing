import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateAuction from "./pages/seller/create_auction";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CreateAuction />} />
                <Route path="/CreateAuction" element={<CreateAuction />} />
            </Routes>
        </Router>
    );
};

export default App;
