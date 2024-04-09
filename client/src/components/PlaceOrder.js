import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from "../contexts/UserContext";

function StockOrderPage() {
  const {userID} = useContext(UserContext);
  const navigate = useNavigate();

  const [ticker, setTicker] = useState('');
  const [numShares, setNumShares] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [cashAllotted, setCashAllotted] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [orderId, setOrderId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userID,
          ticker,
          num_shares: parseInt(numShares),
          max_price: parseInt(maxPrice),
          cash_allotted: parseInt(cashAllotted),
        }),
      });

      const data = await response.json();
      setSuccessMessage('Order placed successfully!');
      setOrderId(data.id);
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOkayClick = () => {
    // Redirect to the view-order page
    navigate('/view-order', { state: { orderID: orderId } });
  };

return (
  <div>
    <h1>Place Stock Order</h1>
    <form onSubmit={handleSubmit}>
      <div>
      </div>
      <div>
        <label htmlFor="ticker">Ticker:</label>
        <input
          type="text"
          id="ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="numShares">Number of Shares:</label>
        <input
          type="number"
          id="numShares"
          value={numShares}
          onChange={(e) => setNumShares(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="maxPrice">Max Price:</label>
        <input
          type="number"
          id="maxPrice"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="cashAllotted">Cash Allotted:</label>
        <input
          type="number"
          id="cashAllotted"
          value={cashAllotted}
          onChange={(e) => setCashAllotted(e.target.value)}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
    {successMessage && (
      <div>
        <p>{successMessage}</p>
        <button onClick={handleOkayClick}>Okay</button>
      </div>
    )}
  </div>
);
}

export default StockOrderPage;
