import {
    EditLocationFromData,
    LocationAttributes,
    LocationCreateDto,
    LocationPatchDto,
    MapLocation,
    NewLocationFormData
} from "../components/pages/Map/Components/utils.ts";
import emitter from "../emitter/eventEmitter.ts";

const API_URL = import.meta.env.VITE_API_URL;


const LocationService = {

    fetchAllAvailableLocations: async (): Promise<MapLocation[] | null> => {
        try {
            emitter.emit("startLoading");
            const userToken = localStorage.getItem("userToken");

            const response = await fetch(`${API_URL}/api/locations`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch locations");
            }

            return await response.json();

        } catch (error: any) {
            console.error("Error creating location:", error.message || error);
            console.error(error.message || "Failed to create new location"); // TODO replace with toast

            emitter.emit("stopLoading");
            return null;
        } finally {
            emitter.emit("stopLoading");
        }
    },

    fetchLocationAttributes: async (): Promise<LocationAttributes | null> => {
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
        } catch (error: any) {
            console.error("Error creating location:", error.message || error);
            console.error(error.message || "Failed to fetch location attributes"); // TODO replace with toast

            emitter.emit("stopLoading");
            return null;
        } finally {
            emitter.emit("stopLoading");
        }
    },

    isLocationCreationFormDataValid: (newLocationFormData: NewLocationFormData): string | null => {
        if (!newLocationFormData.lon) return "Coordinates are required.";
        if (!newLocationFormData.lat) return "Coordinates are required.";
        if (newLocationFormData.name.length < 4) return "Name must be at least 4 characters long.";
        if (newLocationFormData.mainCategoryId == null) return "Main category is required.";
        if (newLocationFormData.conditionId == null) return "Condition is required.";
        if (newLocationFormData.statusId == null) return "Status is required.";
        return null;
    },

    createLocation: async (newLocationPayload: LocationCreateDto): Promise<MapLocation | null> => {
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
        } catch (error: any) {
            console.error("Error creating location:", error.message || error);
            console.error(error.message || "Failed to create new location"); // TODO replace with toast

            emitter.emit("stopLoading");
            return null;
        } finally {
            emitter.emit("stopLoading");
        }
    },

    isLocationEditingFormDataValid: (newLocationFormData: EditLocationFromData): string | null => {
        if (newLocationFormData.name.length < 4) return "Name must be at least 4 characters long.";
        if (newLocationFormData.mainCategoryId == null) return "Main category is required.";
        if (newLocationFormData.conditionId == null) return "Condition is required.";
        if (newLocationFormData.statusId == null) return "Status is required.";
        return null;
    },

    patchLocation: async (patchLocationPayload: LocationPatchDto): Promise<MapLocation | null> => {
        try {
            emitter.emit("startLoading");

            const userToken = localStorage.getItem("userToken");
            const response = await fetch(`${API_URL}/api/locations`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(patchLocationPayload),
            });

            if (!response.ok) {
                const errorData = await response.json(); // TODO make backend respond with {'message': "error description"} to all errors
                throw new Error(errorData.message || "An unknown error occurred while editing the location.");
            }

            return await response.json();
        } catch (error: any) {
            console.error("Error editing location:", error.message || error);
            console.error(error.message || "Failed to edit location"); // TODO replace with toast

            emitter.emit("stopLoading");
            return null;
        } finally {
            emitter.emit("stopLoading");
        }
    },

    deleteLocation: async (deletedLocationId: string): Promise<boolean> => {
        try {
            emitter.emit("startLoading");

            const userToken = localStorage.getItem("userToken");
            const response = await fetch(`${API_URL}/api/locations/${deletedLocationId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 204) {
                const errorData = await response.json(); // TODO make backend respond with {'message': "error description"} to all errors
                throw new Error(errorData.message || "An unknown error occurred while deleting the location.");
            } else {
                return true;
            }

        } catch (error: any) {
            console.error("Error deleting location:", error); // TODO replace with toast

            emitter.emit("stopLoading");
            return false;
        } finally {
            emitter.emit("stopLoading");
        }
    },
}


export default LocationService;