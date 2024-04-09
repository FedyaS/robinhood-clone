import React, { useState } from 'react';

// A basic array of common ticker symbols for suggestions
const COMMON_TICKERS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB'];

const TickerSearch = () => {
  const [ticker, setTicker] = useState('');
  const [tickerData, setTickerData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTickerChange = (e) => {
    setTicker(e.target.value.toUpperCase());
  };

  const fetchTickerData = async (tickerSymbol) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/ticker?symbol=${tickerSymbol}`);
      const data = await response.json();
      setTickerData(data);
    } catch (error) {
      console.error("Error fetching ticker data:", error);
      setTickerData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTickerData(ticker);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="tickerInput">Enter Ticker:</label>
        <input
          id="tickerInput"
          type="text"
          value={ticker}
          onChange={handleTickerChange}
          list="tickers-suggestions"
        />
        <datalist id="tickers-suggestions">
          {COMMON_TICKERS.map((symbol) => (
            <option key={symbol} value={symbol} />
          ))}
        </datalist>
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}

      {tickerData && (
        <div>
          <h2>{tickerData.name} ({ticker})</h2>
          <p>{tickerData.description}</p>
          <h3>Last Price: ${tickerData.last_price / 100}</h3>
          {/* Add more detailed rendering based on your needs */}
        </div>
      )}
    </div>
  );
};

export default TickerSearch;
