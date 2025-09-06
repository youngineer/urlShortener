import { BACKEND_URL, HEADER } from "../utils/constants";
import type { IBackendResponseDto, ILogin, ISignup } from "../utils/types";


const BASE_URL = BACKEND_URL + "/auth";


export async function handleSignup(signupPayload: ISignup): Promise<string> {
    if(signupPayload.password !== signupPayload.confirmPassword) return Promise.reject("Password mismatch");

    const url = BASE_URL + "/signup";
    const request: Request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(signupPayload),
        headers: HEADER,
        credentials: 'include',
    });

    try {
        const response: Response = await fetch(request);
        const data: IBackendResponseDto = await response.json();

        if(!response.ok) {
            return Promise.reject(data.message || 'Signup failed. Please try again');
        } else {
            return data.message;
        }
    } catch (error: any) {
        return Promise.reject(error);
    }
}

export async function handleLogin(loginPayload: ILogin): Promise<string> {
    const url = BASE_URL + "/login";
    const request: Request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(loginPayload),
        headers: HEADER,
        credentials: 'include',
    });

    try {
        const response: Response = await fetch(request);
        const data: IBackendResponseDto = await response.json();

        if(!response.ok) {
            return Promise.reject(data.message || 'Logout failed. Please try again');
        } else {
            return data.message;
        }
    } catch (error: any) {
        return Promise.reject(error);
    }
}

export async function handleLogout(): Promise<string> {
    const url = BASE_URL + "/logout";
    const request: Request = new Request(url, {
        method: "GET",
        headers: HEADER,
        credentials: 'include'
    });

    try {
        const response: Response = await fetch(request);
        const data: IBackendResponseDto = await response.json();

        if(!response.ok) {
            return Promise.reject(data.message || 'Logout failed. Please try again');
        } else {
            return data.message;
        }
    } catch (error) {
        return Promise.reject(error);
    }
}


export async function isLoggedIn() {
    const url: string = BASE_URL + "/isLoggedIn";
    const request: Request = new Request(url, {
        headers: HEADER,
        method: "GET",
        credentials: 'include'
    });

    try {
        const response = await fetch(request);
        if(!response.ok) return false;

        return await response.json();
    } catch (error) {
        return false;
    }
}