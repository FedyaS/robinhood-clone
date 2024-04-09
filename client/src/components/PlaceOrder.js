import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, TextField, Button, Typography, Card, CardContent, CircularProgress } from '@mui/material';

import { UserContext } from "../contexts/UserContext";

function calcCashDollars(numShares, price) {
    return numShares * price
}

function StockOrderPage() {
  const {userID} = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const defaultTicker = location.state?.ticker || '';
  const defaultNumShares = location.state?.numShares || 1;
  const defaultMaxPrice = location.state?.maxPrice || 0;
  const isSellOrder = location.state?.sell || false

  const [ticker, setTicker] = useState(defaultTicker);
  const [numShares, setNumShares] = useState(defaultNumShares);
  const [maxPrice, setMaxPrice] = useState(defaultMaxPrice);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [orderId, setOrderId] = useState(null);

  const sellOrderFetch = () => {

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const body = {
      user_id: userID,
      ticker,
      num_shares: parseInt(numShares),
      
      // SAME VALUE - sell vs order require min vs max, but uses the same form field for now
      max_price: parseInt(maxPrice),
      min_price: parseInt(maxPrice),
      cash_allotted: calcCashDollars(numShares, maxPrice)
    }

    const url = isSellOrder ? 'http://127.0.0.1:5000/sell' : 'http://127.0.0.1:5000/order'

    try {
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!data || !data.id) {
        throw new Error(`Error placing order: ${data.error}`)
      }

      setSuccessMessage('Order placed successfully!');
      setOrderId(data.id);
    } catch (error) {
      console.error('Error placing order:', error);
      setErrorMsg(error.message)
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
        Place {isSellOrder ? 'SELL' : 'BUY'} Order
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
            value={maxPrice / 100} // Display the cents value as dollars
            onChange={(e) => setMaxPrice(e.target.value * 100)} // Convert dollars to cents when input changes
            variant="outlined"
            margin="normal"
            fullWidth
            InputProps={{
              step: "0.01" // Allows decimal inputs to represent cents
            }}
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
      {errorMsg && (<Alert severity="error">{errorMsg}</Alert>)}
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
