import React, { useState } from 'react';

// Style object for component styling
const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial',
    },
    form: {
        marginBottom: '20px',
    },
    input: {
        marginRight: '5px',
    },
    results: {
        marginTop: '20px',
    },
};

// Sample ticker symbols
const popularTickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

const Ticker = () => {
    const [data, setData] = useState(null);
    const [input, setInput] = useState('');

    // Fetch data using native fetch API
    const fetchData = async (ticker) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/ticker?symbol=${ticker}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error("Failed to fetch: ", error);
            setData(null);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData(input);
    };

    return(        // Apply styles in the component
        <div style={styles.container}>
            <h2>Search for a Ticker</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
            <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    list="tickers"
                    placeholder="Enter ticker symbol"
                />
                <datalist id="tickers">
                    {popularTickers.map(ticker => (
                        <option key={ticker} value={ticker} />
                    ))}
                </datalist>
                <button type="submit">Search</button>
            {data && (
                <div>
                    <h3>Results:</h3>
                    <p>ID: {data.id}</p>
                    <p>Time: {new Date(data.time * 1000).toLocaleString()}</p>
                    <p>Ticker Data: {JSON.stringify(data.ticker_data, null, 2)}</p>
                </div>
            )}
            </form>
        </div>
    );
};

export default Ticker;
