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
              <Link to="/ticker">Tickers</Link>
            </li>
            <li>
              <Link to="/place-order">Place Stock Order</Link>
            </li>
            <li>
              <Link to="/view-order">View Order Status</Link>
            </li>

          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ticker" element={<Ticker />} />
          <Route path="/place-order" element={<StockChart />} />
          <Route path="/view-order" element={<StockChart />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home Page</h2>;
}

export default App;
