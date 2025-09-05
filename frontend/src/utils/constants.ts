export const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;
export const HEADER: Headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
});