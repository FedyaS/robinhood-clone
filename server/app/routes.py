from flask import Blueprint, jsonify, request
from flask_cors import CORS
import app.ticker_data as ticker_data
import app.db_client as db_client
import app.process_order as process_order
import app.constants as constants
import threading

main = Blueprint('main', __name__)
CORS(main)

def ticker_exists(ticker):
    return ticker in constants.ALL_TICKERS

@main.route('/')
def index():
    print("/ called")
    return jsonify(message="Hello from Flask!")

# Gets the user's portfolio and info for home page
@main.route('/home', methods=['GET'])
def home():
    print('/home called')
    
    user_id = request.args.get('user_id', default=None, type=str)
    
    if not user_id:
        return jsonify({"error": "No user ID present."}), 401
    
    user, stocks, orders = db_client.query_user_info(user_id)

    return jsonify({
        'user': user,
        'stocks': stocks,
        'orders': orders
    })

# Gets info about specified ticker
@main.route('/ticker', methods=['GET'])
def ticker():
    print("/ticker called")

    # Assuming the ticker symbol is passed as a query parameter
    ticker_symbol = request.args.get('symbol', default='AAPL', type=str)

    if not ticker_exists(ticker_symbol):
        return jsonify({"error": "Invalid ticker. Please try again."}), 400

    data = ticker_data.get_ticker_data(ticker_symbol)

    return jsonify(data)

# Gets just the latest price of specified ticker
@main.route('/ticker-price', methods=['GET'])
def ticker_price():
    print('/ticker-price called')

    ticker_symbol = request.args.get('symbol', default='AAPL', type=str)

    if not ticker_exists(ticker_symbol):
        return jsonify({"error": "Invalid ticker. Please try again."}), 400


    data = ticker_data.get_ticker_price(ticker_symbol)

    return jsonify(data)

# Used to place / track status of a stock order
@main.route('/order', methods=['GET', 'POST'])
def order():
    # Create a new Order
    if request.method == 'POST':
        
        # Confirm that all info is present and valid
        data = request.json
        user_id = data.get('user_id')
        ticker = data.get('ticker')
        num_shares = data.get('num_shares')
        max_price = data.get('max_price')
        cash_allotted = data.get('cash_allotted')

        if any(var is None for var in [user_id, ticker, num_shares, max_price, cash_allotted]):
            return jsonify({"error": "Some data missing in your order request. Please try again."}), 400
        
        if not ticker_exists(ticker):
            return jsonify({"error": "Invalid ticker. Please try again."}), 400

        # Confirm that User has sufficient funds
        user = db_client.get_user(user_id)
        cash_bal = user.get('cash')
        print(cash_bal)
        print(user)
        if not cash_bal or cash_bal < cash_allotted:
            return jsonify({"error": "Insufficient Funds - NSF."}), 401


        # Create a PROCESSING Order
        order_id = db_client.generate_id()
        order = db_client.put_order(user_id, order_id, ticker, num_shares, max_price, cash_allotted)
        
        # Start the background Order Processing
        background_thread = threading.Thread(target=process_order.process_order, args=(user_id, order_id, ticker, num_shares, max_price, cash_allotted))
        background_thread.start()
        
        return jsonify({"status": "PROCESSING", "id": order_id, "data": data}), 200
        
    # GET info about an existing order
    elif request.method == 'GET':
        print('/order GET called')
        user_id = request.args.get('user_id', None)
        order_id = request.args.get('order_id', None)
        
        if user_id and order_id:
            order = db_client.get_stock_order(user_id, order_id)
            return jsonify(order)        
        
        else:
            return jsonify({"error": "Order ID is required for tracking."}), 400

# @main.route('/sell', methods=['GET', 'POST'])
# def sell():
    # if request.method == 'POST':
    #     data = request.json  # Assuming JSON data is sent with the POST request
        
    #     user_id = data.get('user_id', default=None, type=str)
    #     num_shares = data.get('num_shares', default=None, type=int)
    #     min_price = data.get('min_price', default=None, type=int)
    #     ticker = data.get('ticker', default=None, type=str)

    #     if not all(var is not None for var in [user_id, ticker, num_shares, max_price, cash_allotted]):
    #         return jsonify({"error": "Some data missing in your order request. Please try again."}), 400
        
    #     user = db_client.get_user(user_id)
    #     cash_bal = user.get('cash', default=0, type=int)
    #     if not cash_bal or cash_bal < cash_allotted:
    #         return jsonify({"error": "Insufficient Funds - NSF."}), 401


    #     # Place the Order
    #     order_id = db_client.generate_id()
    #     order = db_client.put_order(user_id, order_id, ticker, num_shares, max_price, cash_allotted)
    #     background_thread = threading.Thread(target=place_order, args=(order_id,data,))
    #     background_thread.start()
        
    #     return jsonify({"status": "PROCESSING", "id": order_id, "data": data}), 200
        
    # elif request.method == 'GET':  # For GET request
    #     print('/order GET called')
    #     order_id = request.args.get('order_id', None)
        
    #     if order_id:
    #         order = db_client.get_stock_order(user_id, order_id)
    #         return jsonify(order)        
        
    #     else:
    #         return jsonify({"error": "Order ID is required for tracking."}), 400
