import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { UserContext } from '../contexts/UserContext';

function ViewOrder({}) {
  const { userID } = useContext(UserContext);

  const location = useLocation();
  const orderID = location.state?.orderID;  // Retrieve orderId from the state


  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:5000/order?user_id=${userID}&order_id=${orderID}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setOrder(data);
        console.log(data)
      } catch (error) {
        setError(error.toString());
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [userID]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>No order found.</div>;

  return (
    <div>
      <h2>Order Details</h2>
      <p><strong>ID:</strong> {order.id}</p>
      <p><strong>Ticker:</strong> {order.ticker}</p>
      <p><strong>Number of Shares:</strong> {order.num_shares}</p>
      <p><strong>Max Price Per Share:</strong> {order.max_price_per_share / 100} USD</p>
      <p><strong>Purchase Price Per Share:</strong> {order.purchase_price_per_share / 100} USD</p>
      <p><strong>Cash Allotted:</strong> {order.cash_allotted / 100} USD</p>
      <p><strong>Status:</strong> {order.status}</p>
    </div>
  );
}

export default ViewOrder;
