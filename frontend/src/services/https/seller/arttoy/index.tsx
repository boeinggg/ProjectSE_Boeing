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

export { GetCategory, GetArtToy, GetArtToyById, UpdateArtToysById, DeleteArtToysById, CreateArtToy };
