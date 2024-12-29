import { ArtToysInterface } from "../../../../interfaces/ArtToy";

import axios from "axios";

const apiUrl = "http://localhost:3036";

const Authorization = localStorage.getItem("token");

const Bearer = localStorage.getItem("token_type");

const requestOptions = {
    headers: {
        "Content-Type": "application/json",

        Authorization: `${Bearer} ${Authorization}`,
    },
};

async function GetCategory() {
    return await axios

        .get(`${apiUrl}/categories`, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}

async function GetArtToy() {
    return await axios

        .get(`${apiUrl}/arttoys`, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}

async function GetArtToyById(id: string) {
    return await axios

        .get(`${apiUrl}/arttoy/${id}`, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}

async function UpdateArtToysById(id: string, data: ArtToysInterface) {
    return await axios

        .put(`${apiUrl}/arttoys/${id}`, data, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}

async function DeleteArtToysById(id: string) {
    return await axios

        .delete(`${apiUrl}/arttoys/${id}`, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}

async function CreateArtToy(data: ArtToysInterface) {
    return await axios

        .post(`${apiUrl}/arttoys`, data, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}

async function GetArtToyID() {
    try {
        const response = await axios.get(`${apiUrl}/arttoys/latest`, requestOptions);
        if (response.status === 200) {
            return response.data.id; // Extract and return the ArtToy ID
        } else {
            throw new Error("Failed to fetch the latest ArtToy ID");
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching latest ArtToy ID:", error.response?.data);
            throw new Error(error.response?.data?.error || "Unexpected error occurred");
        } else {
            console.error("Unknown error fetching latest ArtToy ID:", error);
            throw new Error("An unexpected error occurred");
        }
    }
}

export { GetCategory, GetArtToy, GetArtToyById, UpdateArtToysById, DeleteArtToysById, CreateArtToy, GetArtToyID };
