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

export const addAssignment = async (assData,token) => {
    try{
        const res = await axios.post(`${API_URL}/addAssignment`,assData,{
            method : "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization : `${token}`
            }
        })
        return res;
    }catch(error){
        console.error("Error adding assignment ",error);
        throw error;
    }
}
