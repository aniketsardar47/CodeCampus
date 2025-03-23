import React from "react";
import { Link } from "react-router-dom";
import "./styles/home.css";


const Home = () => {
    return (
        <div>
            <h1>Home Screen</h1>
            <Link to="/editor">Go to Editor</Link>
        </div>
    );
};

export default Home;
