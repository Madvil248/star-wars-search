import React from "react";
import { useParams, useLocation } from "react-router-dom";
import "./categoryPage.scss";
import PeopleTable from "./PeopleTable";

const CategoryPage: React.FC = () => {
    const { category } = useParams<{ category?: string }>();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get("search") || "";

    const getCategoryBody = () => {
        switch (category) {
            case "people":
                return <PeopleTable searchQuery={searchTerm} />;
            default:
                return (
                    <div className="category-body">
                        <h2>Search Term: {searchTerm}</h2>
                    </div>
                );
        }
    };

    return (
        <div className="category-page">
            <div className="wrapper">
                <div className="category-header">
                    <img
                        src="//cssanimation.rocks/demo/starwars/images/star.svg"
                        alt="Star"
                        className="star"
                    />
                    <img
                        src="//cssanimation.rocks/demo/starwars/images/wars.svg"
                        alt="Wars"
                        className="wars"
                    />
                    <h2 className="byline" id="byline">
                        {category}
                    </h2>
                </div>
            </div>

            {getCategoryBody()}
        </div>
    );
};

export default CategoryPage;
