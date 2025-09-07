import { BACKEND_URL, HEADER } from "../utils/constants"
import type { IBackendResponseDto, IUrl, IUrlEntry, IUrlMap } from "../utils/types";


const BASE_URL = BACKEND_URL + "/url"

export async function getUrlList(): Promise<IUrlMap | null> {
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
        if(content === null) return null;
        if (!Array.isArray(content)) {
            console.error('Unexpected content format:', content);
            return null;
        }
        return processData(content);
        
    } catch (error) {
        console.error(error);
        return null;
    }
}


export async function deleteUrl(id: number): Promise<boolean> {
    const url = BASE_URL + "/deleteUrl";
    const request: Request = new Request(url, {
        method: "DELETE",
        headers: HEADER,
        body: JSON.stringify(id),
        credentials: 'include'
    });
    try {
        const response = await fetch(request);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error details:", errorText);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return true;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}

export async function addUrl(urlPayload: IUrlEntry): Promise<boolean> {
    const url = BASE_URL + "/addUrl";
    const request: Request = new Request(url, {
        method: "POST",
        headers: HEADER,
        body: JSON.stringify(urlPayload),
        credentials: 'include'
    });
    try {
        const response = await fetch(request);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error details:", errorText);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return true;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}

export async function updateUrl(urlPayload: IUrlEntry): Promise<boolean> {
    const url = BASE_URL + "/updateUrl";
    const request: Request = new Request(url, {
        method: "PATCH",
        headers: HEADER,
        body: JSON.stringify(urlPayload),
        credentials: 'include'
    });
    try {
        const response = await fetch(request);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error details:", errorText);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return true;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}

function processData(urlList: IUrl[]): IUrlMap | null {
    if(urlList === null) return null;

    const urlMap = new Map<number, IUrlEntry>;
    urlList.forEach(url => {
        const urlEntry: IUrlEntry = {
            name: url.name, 
            shortUrl: url.shortUrl, 
            longUrl: url.longUrl, 
            customUrl: url.customUrl,
            qrCode: url.qrCode
        };
        urlMap.set(url.id, urlEntry);
    });

    return urlMap;
}
