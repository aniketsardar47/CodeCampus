import axios from "axios";

const API_URL = "http://localhost:5001/api";

export const fetchUserData = async (token) =>{
    try{
        const res = await axios.get(`${API_URL}/user`,{
            method: "GET",
            headers: {
                Authorization: `${token}`,
            }
        });
        return res.data;
    }catch(error){
        console.error("Error fetching user data ",error);
        throw error;
    }
};