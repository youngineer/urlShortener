export const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;
export const HEADER: Headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
});

// ALertDialog.tsx
export const ERROR_D: string = "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";
export const SUCESS_D: string = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";