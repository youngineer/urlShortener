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
                if(!response) navigate("/auth");
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
                    <h1 className="text-3xl font-bold">linkShrink</h1>
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