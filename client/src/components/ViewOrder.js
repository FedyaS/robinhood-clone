import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { TextField, Button, CircularProgress, Typography, Box, Paper } from '@mui/material';

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
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
        <Typography variant="h4" gutterBottom>
            Order Details
        </Typography>
        {/* Container for the search functionality */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
                <TextField
                    id="orderSearch"
                    label="Search Order ID"
                    type="text"
                    value={searchOrderId}
                    onChange={handleSearchChange}
                    placeholder="Enter Order ID"
                    variant="outlined"
                    sx={{ mr: 2, flexGrow: 1 }}
                />
                <Button variant="contained" color="primary" onClick={() => setSearchOrderId(searchOrderId)}>
                    Search
                </Button>
            </Box>
        </Paper>
        
        {/* Conditional rendering based on the fetching state */}
        {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        ) : error ? (
            <Typography color="error">Error: {error}</Typography>
        ) : order ? (
            // Display order details if an order is found
            <Box>
                <Typography><strong>ID:</strong> {order.id}</Typography>
                <Typography><strong>Ticker:</strong> {order.ticker}</Typography>
                <Typography><strong>Number of Shares:</strong> {order.num_shares}</Typography>
                <Typography><strong>Filled Price Per Share:</strong> {order.filled_price_per_share / 100} USD</Typography>
                <Typography><strong>Total Cash:</strong> {order.num_shares * order.filled_price_per_share / 100} USD</Typography>
                <Typography><strong>Status:</strong> {order.status}</Typography>
            </Box>
        ) : (
            <Typography>Please enter an Order ID to search.</Typography>
        )}
    </Box>
);


}

export default ViewOrder;