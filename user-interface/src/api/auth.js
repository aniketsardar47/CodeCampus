import axios from 'axios';

const API_URL = "http://localhost:5001/api/auth";

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`,userData);
    console.log(response.data)
    return response.data;
};

export const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`,userData);
    return response.data;
};