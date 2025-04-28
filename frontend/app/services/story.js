


export const writeChapter = async(token , content , storyId , name , number)=>{
    try {
        console.log(JSON.stringify({content : content , storyId : storyId , name : name , number : number,token}))
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/story/write-chapter`,{
            method : "POST",
            headers : {
                "Authorization" : `Bearer ${token}`,
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({content : content , storyId : storyId , name : name , number : number})
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }else{
            return await response.json();
        }
    } catch (error) {
        console.log(error);
    }
}

export const getChapter = async(token , id)=>{
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/story/chapters/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}
export const getStory = async(id)=>{
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/story/getStory/${id}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }else{
            return await response.json();
        }
    } catch (error) {
        console.log(error);
    }
}

export const getStories = async(page,limit)=>{
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/story/stories?page=${page}&limit=${limit}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(error);
    }

}

export const getCollab = async(token , id)=>{
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/story/collaborators?id=${encodeURIComponent(id)}`,{
            headers :{
                "Authorization" : `Bearer ${token}`
            }
        })
    if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}