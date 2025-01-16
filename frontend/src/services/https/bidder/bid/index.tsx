import axios from "axios";
import { BidsInterface } from "../../../../interfaces/Bid";

const apiUrl = "http://localhost:3036";

const Authorization = localStorage.getItem("token");

const Bearer = localStorage.getItem("token_type");

const requestOptions = {
    headers: {
        "Content-Type": "application/json",

        Authorization: `${Bearer} ${Authorization}`,
    },
};

async function GetBid() {
    return await axios

        .get(`${apiUrl}/bids`, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}

async function GetBidById(id: string) {
    return await axios

        .get(`${apiUrl}/bid/${id}`, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}

async function CreateBid(data: BidsInterface) {
    return await axios

        .post(`${apiUrl}/bids`, data, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}

async function GetBidHistoryByAuctionId(auctionId: string | number) {
    return await axios
        .get(`${apiUrl}/bids/history/${auctionId}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

export { GetBid, GetBidById, CreateBid, GetBidHistoryByAuctionId };
