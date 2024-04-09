// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Context
import { UserContextProvider } from "./contexts/UserContext";

// Components
import Layout from './components/Layout';
import Ticker from './components/Ticker'
import UserProfile from './components/Home'
import StockOrderPage from './components/PlaceOrder'
import ViewOrder from './components/ViewOrder';

function App() {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<UserProfile />} />
            <Route path="ticker" element={<Ticker />} />
            <Route path="place-order" element={<StockOrderPage />} />
            <Route path="view-order" element={<ViewOrder />} />
          </Route>
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
