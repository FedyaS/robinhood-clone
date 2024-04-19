import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {tenPercentMore} from '../helpers/percent';

import { Alert, TextField, Button, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@mui/material';

import PriceChart from './Chart'

// A basic array of common ticker symbols for suggestions
const COMMON_TICKERS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB'];

const TickerSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultTicker = location.state?.ticker || ''
  
  const [ticker, setTicker] = useState(defaultTicker);
  const [tickerData, setTickerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTickerChange = (e) => {
    setTicker(e.target.value.toUpperCase());
  };

  const fetchTickerData = async (tickerSymbol) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/ticker?symbol=${tickerSymbol}`);
      const data = await response.json();

      if (!data || !data.last_price) {
        throw new Error("Could not fetch ticker info")
      }

      setTickerData(data);
    } catch (error) {
      console.error("Error fetching ticker data:", error);
      setTickerData(null);
      setErrorMsg(error.message)
    } finally {
      setLoading(false);
    }
  };

    const formattedData = useMemo(() => {
    if (!tickerData || !tickerData.history_price) return [];

    return tickerData.history_price.map(item => ({
      Date: item.Date,
      Open: item.Open / 100,
      High: item.High / 100,
      Low: item.Low / 100,
      Close: item.Close / 100,
      Volume: item.Volume
    }));
  }, [tickerData]);
  console.log(formattedData)

  // Fetch ticker right away if passed in
  useEffect(() => {
    if (defaultTicker) {
      fetchTickerData(defaultTicker)
    }
  }, [defaultTicker])

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTickerData(ticker);
  };

  const handleBuy = (e) => {
    navigate('/place-order', { state: { ticker: ticker, numShares: 1, maxPrice: tenPercentMore(tickerData.last_price)   } });
  };

    return (
      <div>
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <TextField
            label="Enter Ticker"
            id="tickerInput"
            type="text"
            value={ticker}
            onChange={handleTickerChange}
            list="tickers-suggestions"
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <datalist id="tickers-suggestions">
            {COMMON_TICKERS.map((symbol) => (
              <option key={symbol} value={symbol} />
            ))}
          </datalist>
          <Button type="submit" variant="contained" color="primary">Search</Button>
        </form>

        {loading && <CircularProgress />}
        {errorMsg && (<Alert severity="error">{errorMsg}</Alert>)}
        {tickerData && (
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                {tickerData.name} ({ticker})
              </Typography>
              <Typography color="textSecondary">
                {tickerData.description}
              </Typography>
              <Typography variant="h6">
                Last Price: ${tickerData.last_price / 100} (as of {new Date(tickerData.last_price_time * 1000).toLocaleDateString("en-US")})
              </Typography>
              <Button variant="contained" onClick={handleBuy}>
                BUY
              </Button>

              {
                tickerData.financials
                  &&
                (<Typography variant="body1" style={{marginTop: '20px'}}>
                  Market Cap: ${tickerData.financials["Market Cap"] / 100} Million, P/E Ratio: {(tickerData.financials["PE Ratio"] / 100).toFixed(2)}, EPS: ${tickerData.financials["EPS"] / 100}, Sector: {tickerData.financials["Sector"]}, Employees: {tickerData.financials["Full Time Employees"]}
                </Typography>)
              }

              <Typography variant="h6" style={{marginTop: '20px'}}>
                Historical Prices
              </Typography>
              {/* <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Open ($)</TableCell>
                    <TableCell align="right">High ($)</TableCell>
                    <TableCell align="right">Low ($)</TableCell>
                    <TableCell align="right">Close ($)</TableCell>
                    <TableCell align="right">Volume</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickerData.history_price.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.Date}</TableCell>
                      <TableCell align="right">${item.Open / 100}</TableCell>
                      <TableCell align="right">${item.High / 100}</TableCell>
                      <TableCell align="right">${item.Low / 100}</TableCell>
                      <TableCell align="right">${item.Close / 100}</TableCell>
                      <TableCell align="right">{item.Volume.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table> */}
                <PriceChart data={formattedData}></PriceChart>

            </CardContent>
          </Card>
        )}
      </div>
    );
};

export default TickerSearch;
