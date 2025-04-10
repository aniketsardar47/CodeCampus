import axios from 'axios';

const API_URL = "https://codecampus-server-tp47.onrender.com/api/auth";

export const register = async (userData) => {
    try{
        const response = await axios.post(`${API_URL}/signup`,userData,{
            headers: {
                'Content-Type': 'application/json'  
            }
        });
        return response.data;
    }catch(error){
        console.error('Registration failed:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Server error' };
    }
};

export const login = async (userData) => {
    try{
        const response = await axios.post(`${API_URL}/login`,userData,{
            headers: {
                'Content-Type': 'application/json'  
            }
        });
        return response.data;
    }catch(error){
        console.error('Login failed:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Server error' };
    }
};