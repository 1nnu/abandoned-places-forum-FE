import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../../../contexts/AuthContext.tsx";
import {MapLocation} from "../MapView/map-utils.ts";

interface FilteringSidebarProps {
    onApplyFilters: (filteredLocations: MapLocation[]) => void;
}

function FilteringSidebar({ onApplyFilters }: FilteringSidebarProps) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [conditions, setConditions] = useState<{ id: number; name: string }[]>([]);
    const [statuses, setStatuses] = useState<{ id: number; name: string }[]>([]);

    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedCondition, setSelectedCondition] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<number | null>(null);

    const { userId } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, conditionsRes, statusesRes] = await Promise.all([
                    axios.get(`${API_URL}/api/location-categories`),
                    axios.get(`${API_URL}/api/locations/conditions`),
                    axios.get(`${API_URL}/api/locations/statuses`),
                ]);

                setCategories(categoriesRes.data);
                setConditions(conditionsRes.data);
                setStatuses(statusesRes.data);
            } catch (error) {
                console.error("Error fetching filter options:", error);
            }
        };

        fetchData();
    }, []);

    const handleCategoryChange = (id: number) => {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
        );
    };

    const handleApplyFilters = async () => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append("userId", userId);

            if (selectedCategories.length > 0) {
                queryParams.append("mainCategoryId", String(selectedCategories[0])); // For now only the first category
            }

            if (selectedCategories.length > 1) {
                selectedCategories.slice(1).forEach((subCategoryId) => {
                    queryParams.append("subCategoryIds", String(subCategoryId));
                });
            }

            if (selectedCondition !== null) {
                queryParams.append("conditionId", String(selectedCondition));
            }

            if (selectedStatus !== null) {
                queryParams.append("statusId", String(selectedStatus));
            }

            const response = await axios.get(
                `${API_URL}/api/locations?${queryParams.toString()}`
            );

            onApplyFilters(response.data);
        } catch (error) {
            console.error("Error applying filters:", error);
        }
    };

    return (
        <div className="p-4 text-white">
            <h2 className="text-lg font-bold mb-4">Filter Locations</h2>

            <div className="mb-4">
                <h3 className="text-md font-semibold">Categories</h3>
                <ul className="list-none">
                    {categories.map((category) => (
                        <li key={category.id} className="mt-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => handleCategoryChange(category.id)}
                                />
                                {category.name}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-4">
                <h3 className="text-md font-semibold">Conditions</h3>
                <ul className="list-none">
                    {conditions.map((condition) => (
                        <li key={condition.id} className="mt-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="condition"
                                    className="mr-2"
                                    checked={selectedCondition === condition.id}
                                    onChange={() => setSelectedCondition(condition.id)}
                                />
                                {condition.name}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-4">
                <h3 className="text-md font-semibold">Statuses</h3>
                <ul className="list-none">
                    {statuses.map((status) => (
                        <li key={status.id} className="mt-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="status"
                                    className="mr-2"
                                    checked={selectedStatus === status.id}
                                    onChange={() => setSelectedStatus(status.id)}
                                />
                                {status.name}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex justify-between mt-4">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded shadow"
                    onClick={handleApplyFilters}
                >
                    Apply
                </button>
            </div>
        </div>
    );
}

export default FilteringSidebar;
