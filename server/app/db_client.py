import random
import string

def generate_id():
    """Generates an 8-letter uppercase ID."""
    return ''.join(random.choices(string.ascii_uppercase, k=8))

def get_user(user_id):
    return

def get_stock_order(stock_order_id):
    return

def query_user_stock(user_id):
    return

def put_order(user_id, order_id, ticker, num_shares, max_price, cash_allotted):
    order = {
        "PK": f'USER${user_id}',
        "SK": f'STOCK_ORDER${order_id}',
        "id": order_id,
        "ticker": ticker,
        "num_shares": num_shares,
        "max_price_per_share": max_price,
        "cash_allotted": cash_allotted,
        "purchase_price_per_share": 0,
        "status": 'PROCESSING',
        "type": 'STOCK_ORDER'
    }

    return order
