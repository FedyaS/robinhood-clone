from flask import Blueprint, jsonify, request
from flask_cors import CORS
import time
import ticker_data
import threading

main = Blueprint('main', __name__)
CORS(main)
import os

def get_single_entity_from_db():
    return {}

def query_user_stock_info_from_db():
    return {}

def create_order_instance_db():
    return {}

# Dummy function to simulate background task
def place_order(ticker):
    # Simulate some time-consuming task
    # In real-world scenario, replace this with your actual function
    print(f"Processing {ticker} in the background...")
    with open('db.txt', 'a') as db_file:
        db_file.write(ticker + '\n')

@main.route('/')
def index():
    print("fff")
    return jsonify(message="Hello from Flask!")

# Gets the user's portfolio and info for home page
@main.route('/home', methods=['GET'])
def home():
    print('/home called')
    
    user_id = request.args.get('user_id', default='123456', type=str)
    
    user = get_single_entity_from_db(user_id)
    stocks = query_user_stock_info_from_db(user_id)

    return jsonify({
        'user': user,
        'cash': stocks[0],
        'stocks': stocks[1:]
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
        order_id = create_order_instance_db(data)
        background_thread = threading.Thread(target=place_order, args=(order_id,data,))
        background_thread.start()
        
        return jsonify({"status": "PROCESSING", "id": order_id, "data": data}), 200
        
    elif request.method == 'GET':  # For GET request
        print('/order GET called')
        order_id = request.args.get('order_id', None)
        
        if order_id:
            order = get_single_entity_from_db(order_id)
            return jsonify(order)        
        
        else:
            return jsonify({"error": "Order ID is required for tracking."}), 400

@main.route('/dashboard', methods=['GET'])
def dashboard():
    print("k lok")
    return jsonify({
        "id": 123,
        "info": "Here is your dashboard",
        "time": int(time.time())  # Current time since epoch in seconds
    })


