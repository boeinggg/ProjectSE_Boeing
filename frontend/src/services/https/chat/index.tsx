import axios from "axios";
import { ChatsInterface } from "../../../interfaces/Chat";

const apiUrl = "http://localhost:3036";

const Authorization = localStorage.getItem("token");

const Bearer = localStorage.getItem("token_type");

const requestOptions = {
    headers: {
        "Content-Type": "application/json",

        Authorization: `${Bearer} ${Authorization}`,
    },
};



async function CreateChat(data: ChatsInterface) {
    return await axios

        .post(`${apiUrl}/chats`, data, requestOptions)

        .then((res) => res)

        .catch((e) => e.response);
}



export {CreateChat };
