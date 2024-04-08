import yfinance as yf
import time

def get_ticker_data(ticker):
    if not ticker:
        return {}

    try:
        # Fetch the stock information
        stock = yf.Ticker(ticker)

        # Get historical prices for the last 3 months
        hist = stock.history(period="3mo")

        # Simplify the historical data for return
        his_prices = hist.reset_index()[["Date", "Open", "High", "Low", "Close", "Volume"]].to_dict(orient='records')

        # Fetch the last price (the close price of the last available date)
        last_price = hist.iloc[-1]['Close']

        # Get additional financial information
        info = stock.info

        # Prepare financials data, you may adjust the fields according to your requirements
        financials = {
            "Market Cap": info.get('marketCap'),
            "PE Ratio": info.get('trailingPE'),
            "EPS": info.get('trailingEps'),
            "Sector": info.get('sector'),
            "Full Time Employees": info.get('fullTimeEmployees'),
        }

        return {
            "history_price": his_prices,
            "last_price": last_price,
            "last_price_time": time.time(),
            "name": info.get('shortName'),
            "description": info.get('longBusinessSummary'),
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

        # Return the close price of the last available trading day
        return {
            "last_price": hist.iloc[-1]['Close'] if not hist.empty else "N/A",
            "time": time.time()
        }
    except Exception as e:
        print(f"Failed to fetch data for {ticker}: {e}")
        return {}
