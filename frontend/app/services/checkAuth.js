
import { jwtDecode } from 'jwt-decode';
export const checkAuth =()=>{
    if(typeof window !== 'undefined'){
        const token = localStorage.getItem("token");
        if(!token){
            return false ;
        }
        try {
            const decoded= jwtDecode(token);
            const time = Math.floor(Date.now()/1000);
            if(decoded.exp && decoded.exp < time){
                console.warn("Token is expired");
                return false;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

}