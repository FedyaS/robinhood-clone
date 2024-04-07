// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard'; // Assuming Dashboard.js is in the same directory
import Ticker from './components/Ticker'
import StockChart from './components/Research'

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/ticker">Tickers</Link>
            </li>
                        <li>
              <Link to="/research">Research</Link>
            </li>

          </ul>
        </nav>

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ticker" element={<Ticker />} />
          <Route path="/" element={<Home />} />
                    <Route path="/research" element={<StockChart />} />

        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home Page</h2>;
}

export default App;
