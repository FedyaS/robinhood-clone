from flask import Blueprint, jsonify, request
from flask_cors import CORS
import app.ticker_data as ticker_data
import app.db_client as db_client
import app.process_order as process_order
import threading

main = Blueprint('main', __name__)
CORS(main)

@main.route('/')
def index():
    print("fff")
    return jsonify(message="Hello from Flask!")

# Gets the user's portfolio and info for home page
@main.route('/home', methods=['GET'])
def home():
    print('/home called')
    
    user_id = request.args.get('user_id', default='123456', type=str)
    print(request)
    print(user_id)
    user = db_client.get_user(user_id)
    stocks = db_client.query_user_stock(user_id)

    return jsonify({
        'user': user,
        'stocks': stocks
    })

# Gets all info about specified ticker
@main.route('/ticker', methods=['GET'])
def ticker():
    print("/ticker called")

    # Assuming the ticker symbol is passed as a query parameter
    ticker_symbol = request.args.get('symbol', default='AAPL', type=str)

    data = ticker_data.get_ticker_data(ticker_symbol)

    return jsonify(data)

# Gets just the latest price of specified ticker
@main.route('/ticker-price', methods=['GET'])
def ticker_price():
    print('/ticker-price called')

    ticker_symbol = request.args.get('symbol', default='AAPL', type=str)
    data = ticker_data.get_ticker_price(ticker_symbol)

    return jsonify(data)

# Used to place / track status of a stock order
@main.route('/order', methods=['GET', 'POST'])
def order():
    if request.method == 'POST':
        data = request.json  # Assuming JSON data is sent with the POST request
        
        user_id = data.get('user_id')
        ticker = data.get('ticker')
        num_shares = data.get('num_shares')
        max_price = data.get('max_price')
        cash_allotted = data.get('cash_allotted')

        if not all(var is not None for var in [user_id, ticker, num_shares, max_price, cash_allotted]):
            return jsonify({"error": "Some data missing in your order request. Please try again."}), 400
        
        user = db_client.get_user(user_id)
        cash_bal = user.get('cash')
        if not cash_bal or cash_bal < cash_allotted:
            return jsonify({"error": "Insufficient Funds - NSF."}), 401


        # Place the Order
        order_id = db_client.generate_id()
        order = db_client.put_order(user_id, order_id, ticker, num_shares, max_price, cash_allotted)
        background_thread = threading.Thread(target=process_order.process_order, args=(user_id, order_id, ticker, num_shares, max_price, cash_allotted))
        background_thread.start()
        
        return jsonify({"status": "PROCESSING", "id": order_id, "data": data}), 200
        
    elif request.method == 'GET':  # For GET request
        print('/order GET called')
        order_id = request.args.get('order_id', None)
        
        if order_id:
            order = db_client.get_stock_order(user_id, order_id)
            return jsonify(order)        
        
        else:
            return jsonify({"error": "Order ID is required for tracking."}), 400

@main.route('/sell', methods=['GET', 'POST'])
def sell():
    if request.method == 'POST':
        data = request.json  # Assuming JSON data is sent with the POST request
        
        user_id = data.get('user_id', default=None, type=str)
        num_shares = data.get('num_shares', default=None, type=int)
        min_price = data.get('min_price', default=None, type=int)
        ticker = data.get('ticker', default=None, type=str)

        if not all(var is not None for var in [user_id, ticker, num_shares, max_price, cash_allotted]):
            return jsonify({"error": "Some data missing in your order request. Please try again."}), 400
        
        user = db_client.get_user(user_id)
        cash_bal = user.get('cash', default=0, type=int)
        if not cash_bal or cash_bal < cash_allotted:
            return jsonify({"error": "Insufficient Funds - NSF."}), 401


        # Place the Order
        order_id = db_client.generate_id()
        order = db_client.put_order(user_id, order_id, ticker, num_shares, max_price, cash_allotted)
        background_thread = threading.Thread(target=place_order, args=(order_id,data,))
        background_thread.start()
        
        return jsonify({"status": "PROCESSING", "id": order_id, "data": data}), 200
        
    elif request.method == 'GET':  # For GET request
        print('/order GET called')
        order_id = request.args.get('order_id', None)
        
        if order_id:
            order = db_client.get_stock_order(user_id, order_id)
            return jsonify(order)        
        
        else:
            return jsonify({"error": "Order ID is required for tracking."}), 400
