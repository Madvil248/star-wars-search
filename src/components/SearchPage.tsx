import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./searchPage.scss";
import Loader from "./small/loader";
import ViewAll from "./small/viewAll";

interface SearchResult {
    name?: string;
    title?: string;
    url: string;
}

interface CategoryResults {
    category: string;
    results: SearchResult[];
}

const SearchPage: React.FC = () => {
    const [query, setQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([]);
    const [categoryResults, setCategoryResults] = useState<CategoryResults[]>(
        []
    );
    const debounceRef = useRef<NodeJS.Timeout>();
    const navigate = useNavigate();

    const getAPIs = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://swapi.dev/api/`);
            const newCategories = Object.keys(response.data);
            if (newCategories.length) {
                setCategories(newCategories);
                setError("");
            }
            setIsLoading(false);
        } catch (err: any) {
            setError(err);
            setIsLoading(false);
            console.error("Error: ", err);
        }
    };

    const fetchResults = async () => {
        setIsLoading(true);
        if (!categories.length) {
            setError("Please refresh the page.");
        }

        try {
            const promises = categories.map(async (category) => {
                const response = await axios.get(
                    `https://swapi.dev/api/${category}/?search=${query}`
                );
                const results = response.data.results.slice(0, 3); // Top 3 matches
                return {
                    category,
                    results,
                };
            });
            const results = await Promise.all(promises);
            const resultsFiltered = results.filter(
                (item: any) => item.results.length
            );
            if (resultsFiltered.length) {
                setCategoryResults(results);
            } else {
                setCategoryResults([]);
            }
        } catch (error) {
            setError("");
            console.error("Error fetching data:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getAPIs();
    }, []);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (query.length >= 1) {
            debounceRef.current = setTimeout(() => {
                fetchResults();
            }, 1000);
        } else if (categoryResults.length > 0) {
            setCategoryResults([]);
        }
        return () => {
            clearTimeout(debounceRef.current);
        };
    }, [query]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleViewAll = (category: string) => {
        navigate(`/${category}?search=${query}`);
    };

    const renderResults = () => {
        if (isLoading) {
            return <Loader />;
        }

        if (categoryResults.length === 0) {
            return null;
        }

        return (
            <div className="autocomplete-results">
                {categoryResults.map(({ category, results }) => (
                    <div key={category} className="category-section">
                        <div className="category-section-header">
                            <h4>
                                {category.charAt(0).toUpperCase() +
                                    category.slice(1)}
                            </h4>
                            <div className="category-view-all">
                                <button onClick={() => handleViewAll(category)}>
                                    <ViewAll />
                                </button>
                            </div>
                        </div>
                        <ul>
                            {results.map((result) => (
                                <li key={result.url}>
                                    {result.name || result.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="searchBody">
            <div className={`searchBox ${query ? "searchFilled" : ""}`}>
                <input
                    type="text"
                    value={query}
                    placeholder=""
                    autoComplete="off"
                    onChange={handleInputChange}
                />
                <label>
                    Search{" "}
                    <span>
                        STAR WARS<span className="search-logo">STAR WARS</span>
                    </span>{" "}
                    universe
                </label>
                <div className="bar"></div>
            </div>
            {error && <p>{error}</p>}
            {renderResults()}
        </div>
    );
};

export default SearchPage;
