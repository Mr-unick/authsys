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
    const [selectedItem, setSelectedItem] = useState(null)

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
        setSelectedItem
        setShowDropdown(false);
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={input}
                onChange={handleChange}
                className="h-14 w-full px-5 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50/20 focus:border-indigo-500 transition-all text-sm placeholder:text-slate-300 bg-white shadow-sm font-medium text-slate-600 outline-none mb-2"
                placeholder={placeholder}
            />
            {showDropdown && results.length > 0 && (
                <ul className="absolute z-50 bg-white border border-slate-100 w-full mt-2 shadow-2xl rounded-2xl max-h-64 overflow-auto py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {results.map((item) => (
                        <li
                            key={item.id}
                            className="px-5 py-3 hover:bg-slate-50 cursor-pointer text-sm font-medium text-slate-600 transition-colors border-b border-slate-50 last:border-0"
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
