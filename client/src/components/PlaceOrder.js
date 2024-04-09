import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Card, CardContent, CircularProgress } from '@mui/material';

import { UserContext } from "../contexts/UserContext";

function calcCashDollars(numShares, price) {
    return numShares * price
}

function StockOrderPage() {
  const {userID} = useContext(UserContext);
  const navigate = useNavigate();

  const [ticker, setTicker] = useState('');
  const [numShares, setNumShares] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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
          cash_allotted: calcCashDollars(numShares, maxPrice)
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
  <Card>
    <CardContent>
      <Typography variant="h4" gutterBottom>
        Place Stock Order
      </Typography>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Ticker"
            type="text"
            id="ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
          />
        </div>
        <div>
          <TextField
            label="Number of Shares"
            type="number"
            id="numShares"
            value={numShares}
            onChange={(e) => setNumShares(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
          />
        </div>
        <div>
          <TextField
            label="Max Price ($)"
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
          />
          {numShares && maxPrice && (
            <Typography variant="body2" style={{ marginTop: '10px' }}>
              Total Amount: ${calcCashDollars(numShares, maxPrice) / 100}
            </Typography>
          )}
        </div>
        <Button type="submit" variant="contained" color="primary" disabled={isLoading} fullWidth>
          {isLoading ? <CircularProgress size={24} /> : 'Place Order'}
        </Button>
      </form>
      {successMessage && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="body1" color="success.main">
            {successMessage}
          </Typography>
          <Button onClick={handleOkayClick} variant="outlined" color="primary">
            Okay
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);
}

export default StockOrderPage;
