// Homepage.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
    const history = useNavigate();

    const handleButtonClick = () => {
        history("/category");
    };

    useEffect(() => {
        document.body.classList.add("route-home");
        return () => {
            document.body.classList.remove("route-home");
        };
    }, []);

    return (
        <div className="home-page">
            <div className="image-container">
                <div className="text-overlay">
                    <h1>Welcome</h1>
        
                </div>
                <img src="/images/myntra.jpg" alt="Category Image" className="category-image" />
                <button onClick={handleButtonClick} className="category-button">
                    Go to Category
                </button>
            </div>
        </div>
    );
};

export default Homepage;
