// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Context
import { UserContextProvider } from "./contexts/UserContext";

// Components
import Ticker from './components/Ticker'
import StockChart from './components/Research'
import UserProfile from './components/Home'
import StockOrderPage from './components/PlaceOrder'

function App() {
  return (
    <UserContextProvider>
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
            <Route path="/" element={<UserProfile />} />
            <Route path="/ticker" element={<Ticker />} />
            <Route path="/place-order" element={<StockOrderPage />} />
            <Route path="/view-order" element={<StockChart />} />
          </Routes>
        </div>
      </Router>
    </UserContextProvider>
  );
}

function Home() {
  return <h2>Home Page</h2>;
}

export default App;
