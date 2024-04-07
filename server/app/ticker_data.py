import yfinance as yf

def get_ticker_data(ticker):
    print(f'ticker_data called lol: {ticker}')
    
    # Fetch the ticker data from yFinance
    ticker_obj = yf.Ticker(ticker)
    
    # Get historical market data
    hist = ticker_obj.history(period="1d")  # For today's data

    # Check if there is any data returned
    if hist.empty:
        print(f"No data found for {ticker}")
        return {}

    # Assuming we want to return the last row (today's data)
    last_row = hist.iloc[-1]

    data = {
        "open": last_row['Open'],
        "close": last_row['Close'],
        "high": last_row['High'],
        "low": last_row['Low'],
        "volume": last_row['Volume']
    }
    
    return data

def store_ticker_info(ticker, data):
    history_price = data['price']
    curr_price = data['curr_price']
    datetime = data['time']
    financials = data['financials']

    
    saved_data = {
        'history_price': history_price,
        'last_price': curr_price,
        'last_price_time': datetime,
        'name': ticker,
        'pe_ration': financials['pe']
    }

    return saved_data