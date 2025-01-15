import { AuctionInterface } from "../../../../interfaces/Auction";

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

async function GetArtToy() {
    return await axios

        .get(`${apiUrl}/arttoys`, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}

async function GetAuction() {
    return await axios

        .get(`${apiUrl}/auctions`, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}

async function GetAutionById(id: string) {
    return await axios

        .get(`${apiUrl}/auction/${id}`, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}

async function UpdateAuctionById(id: string, data: AuctionInterface) {
    return await axios

        .put(`${apiUrl}/auctions/${id}`, data, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}

async function DeleteAuctionById(id: string) {
    return await axios

        .delete(`${apiUrl}/auctions/${id}`, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}

async function CreateAuction(data: AuctionInterface) {
    return await axios

        .post(`${apiUrl}/auctions`, data, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}

async function UpdateAuctionStatus(id: string, status: string) {
    return await axios
        .put(
            `${apiUrl}/auctions/${id}/status`, // ใช้ URL ที่ตรงกับ Gin Route
            { status }, // ส่ง status ผ่าน request body
            requestOptions // headers ที่ต้องการ
        )
        .then((res) => res)
        .catch((e) => e.response);
}

export { GetAuction, GetArtToy, GetAutionById, UpdateAuctionById, DeleteAuctionById, CreateAuction, UpdateAuctionStatus };
