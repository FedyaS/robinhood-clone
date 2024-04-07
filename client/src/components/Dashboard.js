// client/src/components/Dashboard.js

import React, { useState } from 'react';
import './Dashboard.css'; // Import the CSS file for styling

const Dashboard = () => {
    const [data, setData] = useState({});

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/dashboard');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();
            console.log(jsonData);
            setData(jsonData);
        } catch (error) {
            console.error("Failed to fetch: ", error);
        }
    };

    return (
        <div className="dashboard-container"> {/* Apply a class for styling */}
            <h1 className="dashboard-title">Dashboard</h1> {/* Apply a class for styling */}
            {data.id && <div className="data-container"> {/* Apply a class for styling */}
                <p className="data-item">ID: {data.id}</p> {/* Apply a class for styling */}
                <p className="data-item">Info: {data.info}</p> {/* Apply a class for styling */}
                <p className="data-item">Time: {data.time}</p> {/* Apply a class for styling */}
            </div>}
            <button className="fetch-button" onClick={fetchData}>GET</button> {/* Apply a class for styling */}
        </div>
    );
};

export default Dashboard;
