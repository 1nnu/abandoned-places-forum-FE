import {LocationAttributes, LocationCreateDto, MapLocation} from "../components/pages/Map/Components/utils.ts";
import emitter from "../emitter/eventEmitter.ts";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchLocationAttributes = async (): Promise<LocationAttributes | null> => {
    try {
        emitter.emit("startLoading");

        const userToken = localStorage.getItem("userToken");
        const response = await fetch(`${API_URL}/api/locations/attributes`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json(); // TODO make backend respond with {'message': "error description"} to all errors
            throw new Error(errorData.message || "Failed to fetch location attributes");
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating location:", error.message || error);
        alert(error.message || "Failed to fetch location attributes"); // TODO replace with toast

        emitter.emit("stopLoading");
        return null;
    } finally {
        emitter.emit("stopLoading");
    }
};

export const createLocation = async (newLocationPayload: LocationCreateDto): Promise<MapLocation | null> => {
    try {
        emitter.emit("startLoading");

        const userToken = localStorage.getItem("userToken");
        const response = await fetch(`${API_URL}/api/locations`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newLocationPayload),
        });

        if (!response.ok) {
            const errorData = await response.json(); // TODO make backend respond with {'message': "error description"} to all errors
            throw new Error(errorData.message || "An unknown error occurred while creating the location.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating location:", error.message || error);
        alert(error.message || "Failed to create new location"); // TODO replace with toast

        emitter.emit("stopLoading");
        return null;
    } finally {
        emitter.emit("stopLoading");
    }
};
