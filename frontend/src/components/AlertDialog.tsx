import { useState, useEffect } from 'react'
import type { IAlertInfo } from '../utils/types'
import { ERROR_D, SUCESS_D } from '../utils/constants'

const AlertDialog = (alert: IAlertInfo) => {
    const dVal: string = alert.isError ? ERROR_D : SUCESS_D;
    const className = alert.isError ? "alert alert-error max-w-xs flex justify-centre" : "alert alert-success max-w-xs flex justify-centre";
    const [showAlert, setShowAlert] = useState<boolean>(true);
    useEffect(() => {
        if (!showAlert) return;
        const t = setTimeout(() => {
            setShowAlert(false);
        }, 3000);
        return () => clearTimeout(t);
    }, [showAlert]);
    
    if (!showAlert) return null;

    return (
        <div role="alert" className={className}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={dVal} />
            </svg>
            <span>{alert.message}</span>
        </div>
    )
}

export default AlertDialog;