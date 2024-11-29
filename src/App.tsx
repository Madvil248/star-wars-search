import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import CategoryPage from "./components/CategoryPage";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SearchPage />} />
                <Route path="/:category" element={<CategoryPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
