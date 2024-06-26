import app.ticker_data as ticker_data
import app.db_client as db_client

def process_order(user_id, order_id, ticker, num_shares, max_price, cash_allotted):
    print(f"Processing Order {order_id} in the background...")
    
    last_price = ticker_data.get_ticker_price(ticker)
    print(f"Order {order_id} - current price - {last_price}")

    if last_price <= max_price:
        print(f"Filled BUY Order {order_id} at {last_price} per share")
        
        money_spent = last_price * num_shares
        money_difference = cash_allotted - money_spent

        db_client.finish_order(user_id, order_id, int(money_difference), ticker, last_price, num_shares)
    
    else:
        print(f"Cancelled Order {order_id} as {last_price} exceeds {max_price}")
        db_client.cancel_order(user_id, order_id, cash_allotted)

    print(f"Finished Processing Order ${order_id}")

def process_sell_order(user_id, order_id, ticker, num_shares, min_price):
    print(f"Processing Order {order_id} in the background...")
    
    last_price = ticker_data.get_ticker_price(ticker)
    print(f"Order {order_id} - current price - {last_price}")

    if last_price >= min_price:
        print(f"Filled SELL Order {order_id} at {last_price} per share")
        
        cash_influx = last_price * num_shares

        db_client.finish_sell_order(user_id, order_id, last_price, cash_influx)
    
    else:
        print(f"Cancelled Order {order_id} as {last_price} is below {min_price}")
        db_client.cancel_sell_order(user_id, order_id, ticker, num_shares)

    print(f"Finished Processing Order ${order_id}")

