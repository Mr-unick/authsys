import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

const AutocompleteComponent = ({
    apiEndpoint,
    queryKey = "q",
    debounceTime = 100,
    placeholder = "Search...",
    minChars = 1,
    onSelect,
    renderItem,
    extractQuery = (input) => input, // Default: full input is used for search
}) => {
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // Fetch results from API
    const fetchResults = async (query) => {
        if (!query || query.length < minChars) {
            setResults([]);
            return;
        }

        try {
            const { data } = await axios.get(`${apiEndpoint}?${queryKey}=${query}`);
            setResults(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Debounce API calls for optimization

    const debouncedFetch = useCallback(debounce(fetchResults, debounceTime), []);

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);

        const query = extractQuery(value);
        if (query) {
            debouncedFetch(query);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleSelect = (item) => {
        onSelect(item);
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={input}
                onChange={handleChange}
                className="border p-2 w-full rounded-md text-sm outline-none focus-none mb-5"
                placeholder={placeholder}
               
            />
            {showDropdown && results.length > 0 && (
                <ul className="absolute bg-white border w-full mt-1 shadow-md max-h-48 overflow-auto">
                    {results.map((item) => (
                        <li
                            key={item.id}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSelect(item)}
                        >
                            {renderItem(item)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteComponent;
