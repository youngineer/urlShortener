import { useEffect, useState } from "react";
import { handleLogout, isLoggedIn } from "../services/authServices";
import { useNavigate } from "react-router-dom";
import AlertDialog from "./AlertDialog";
import type { IAlertInfo } from "../utils/types";

const Navbar = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState<IAlertInfo | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

    const logout = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            const response: string = await handleLogout();
            if(!response) throw new Error("Logout unsuccessful!")
            setAlert({isError: false, message: "Logout successful!"});
            navigate("/auth");

        } catch (error: any) {
            setAlert({isError: true, message: error.message});
        }
    }

    useEffect(() => {
        const checkAuth = async (): Promise<void> => {
            try {
                const response: boolean = await isLoggedIn();
                setIsAuthenticated(response);
                if(!response) {
                    navigate("/auth");
                } else {
                    navigate("/url");
                }
            } catch (error) {
                setIsAuthenticated(false);
                navigate("/auth");
            }
        };
        checkAuth();
    }, [navigate])


    return (
        <div>
            <div className="bg-base-100 shadow-sm">
            <div className="navbar container mx-auto">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm5-6h4c2.76 0 5 2.24 5 5s-2.24 5-5 5h-4v-1.9h4c1.71 0 3.1-1.39 3.1-3.1s-1.39-3.1-3.1-3.1h-4V7z"/>
                        </svg>
                        <h1 className="text-3xl font-bold">linkShrink</h1>
                    </div>
                </div>
                {
                    isAuthenticated && (
                        <div className="flex-none">
                            <button className="btn btn-ghost p-2 text-lg" onClick={logout}>logout</button>
                        </div>
                    )
                }
            </div>
        </div>
        {alert && (<AlertDialog {...alert!}/>)}
        </div>
    )
}

export default Navbar