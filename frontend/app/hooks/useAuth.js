import { useRouter } from "next/navigation";
import { checkAuth } from "../services/checkAuth";
import { useEffect, useState } from "react";

const useAuth=()=>{
    const [showAlert, setShowAlert] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const isAuth = checkAuth();
        if (!isAuth) {
            setShowAlert(true);
            const timeout = setTimeout(() => {
                router.push('/'); // Redirect to home or login page
            }, 4000);

            return () => clearTimeout(timeout);
        }
    }, [router]);

    return showAlert;
};

export default useAuth;
