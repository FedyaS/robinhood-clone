// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Context
import { UserContextProvider } from "./contexts/UserContext";

// Components
import Ticker from './components/Ticker'
import UserProfile from './components/Home'
import StockOrderPage from './components/PlaceOrder'
import ViewOrder from './components/ViewOrder';

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
            <Route path="/view-order" element={<ViewOrder />} />
          </Routes>
        </div>
      </Router>
    </UserContextProvider>
  );
}

export default App;
