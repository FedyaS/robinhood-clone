import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { UserContext } from '../contexts/UserContext';

function ViewOrder() {
  const { userID } = useContext(UserContext);
  const location = useLocation();

  // Initially set orderID from the location state, if available
  const initialStateOrderID = location.state?.orderID || '';
  const [searchOrderId, setSearchOrderId] = useState(initialStateOrderID);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchOrderId) return; // Exit if searchOrderId is not set

    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:5000/order?user_id=${userID}&order_id=${searchOrderId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setOrder(data);
        console.log(data);
      } catch (error) {
        setError(error.toString());
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [userID, searchOrderId]); // Listen for changes to either userID or searchOrderId

  const handleSearchChange = (e) => {
    setSearchOrderId(e.target.value);
  };

  return (
    <div>
      <h2>Order Details</h2>
      {/* Container for the search functionality */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="orderSearch" style={{ marginRight: '10px' }}>Search Order ID:</label>
        <input
          id="orderSearch"
          type="text"
          value={searchOrderId}
          onChange={handleSearchChange}
          placeholder="Enter Order ID"
          style={{ marginRight: '10px' }}
        />
        <button onClick={() => setSearchOrderId(searchOrderId)}>Search</button>
      </div>
    
      {/* Conditional rendering based on the fetching state */}
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : order ? (
        // Display order details if an order is found
        <div>
          <p><strong>ID:</strong> {order.id}</p>
          <p><strong>Ticker:</strong> {order.ticker}</p>
          <p><strong>Number of Shares:</strong> {order.num_shares}</p>
          <p><strong>Max Price Per Share:</strong> {order.max_price_per_share / 100} USD</p>
          <p><strong>Purchase Price Per Share:</strong> {order.purchase_price_per_share / 100} USD</p>
          <p><strong>Cash Allotted:</strong> {order.cash_allotted / 100} USD</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>
      ) : (
        <div>Please enter an Order ID to search.</div>
      )}
    </div>
);

}

export default ViewOrder;