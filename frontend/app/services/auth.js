
export const login = async(email,password)=>{
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/login`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({email:email,password:password})
        });
        if(response.ok){
            const data = await response.json();
            return data;
        }else{
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

export const register = async(username , email , password)=>{
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/register`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({username:username ,email:email,password:password})
        });
        if(response.ok){
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}


export const logout = ()=>{
    if(typeof window !== "undefined"){
        
        localStorage.clear();
        window.location.href = "/"
        return true;
    }
}