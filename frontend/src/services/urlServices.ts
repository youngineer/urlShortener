import { BACKEND_URL, HEADER } from "../utils/constants"
import type { IBackendResponseDto, IUrl } from "../utils/types";


const BASE_URL = BACKEND_URL + "/url"

export async function getUrlList(): Promise<IUrl[] | null> {
    const url = BASE_URL + "/";
    const request: Request = new Request(url, {
        method: "GET",
        headers: HEADER,
        credentials: 'include'
    });

    try {
        const response = await fetch(request);
        const data: IBackendResponseDto = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || 'Failed to fetch url list');
        }
        
        const content = data?.content;
        if (!Array.isArray(content)) {
            console.error('Unexpected content format:', content);
            return null;
        }
        return content;
        
    } catch (error) {
        console.error(error);
        return null;
    }
}
