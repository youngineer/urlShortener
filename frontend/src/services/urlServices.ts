import { BACKEND_URL, HEADER } from "../utils/constants"


const BASE_URL = BACKEND_URL + "/url"

export async function getUrlList() {
    const url = BASE_URL + "/";
    const request: Request = new Request(url, {
        method: "GET",
        headers: HEADER,
        credentials: 'include'
    });

    try {
        const response = await fetch(request);
        if(!response.ok) throw new Error("Try again");
        console.log(response.body)
        return await response.json();
    } catch (error) {
        return error;
    }
    
}