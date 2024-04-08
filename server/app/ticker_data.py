import yfinance as yf
import time

def get_ticker_data(ticker):
    if not ticker:
        return {}

    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="3mo")

        # Convert price data to cents and simplify for return
        his_prices = []
        for _, row in hist.reset_index().iterrows():
            his_prices.append({
                "Date": row['Date'].date().isoformat(),
                "Open": int(row['Open'] * 100),
                "High": int(row['High'] * 100),
                "Low": int(row['Low'] * 100),
                "Close": int(row['Close'] * 100),
                "Volume": row['Volume']
            })

        last_price = int(hist.iloc[-1]['Close'] * 100)

        info = stock.info

        financials = {
            "Market Cap": info.get('marketCap', 0) // 100,  # Assuming market cap is already in cents
            "PE Ratio": int(info.get('trailingPE', 0) * 100) if info.get('trailingPE') is not None else None,
            "EPS": int(info.get('trailingEps', 0) * 100) if info.get('trailingEps') is not None else None,
            "Sector": info.get('sector', ''),
            "Full Time Employees": info.get('fullTimeEmployees', 0),
        }

        return {
            "history_price": his_prices,
            "last_price": last_price,
            "last_price_time": int(time.time()),
            "name": info.get('shortName', ''),
            "description": info.get('longBusinessSummary', ''),
            "financials": financials
        }
    except Exception as e:
        print(f"Failed to fetch data for {ticker}: {e}")
        return {}


def get_ticker_price(ticker):
    if not ticker:
        return {}

    try:
        stock = yf.Ticker(ticker)

        # Fetch the latest price using history method
        hist = stock.history(period="1d")
        last_price = int(hist.iloc[-1]['Close'] * 100) if not hist.empty else "N/A"

        # Return the close price of the last available trading day
        return {
            "last_price": last_price,
            "time": time.time()
        }
    except Exception as e:
        print(f"Failed to fetch data for {ticker}: {e}")
        return {}
