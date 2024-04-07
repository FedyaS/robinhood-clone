from flask import Blueprint, jsonify, request
from flask_cors import CORS
import time
import ticker_data
main = Blueprint('main', __name__)
CORS(main)
import os
print("Current Working Directory:", os.getcwd())

@main.route('/')
def index():
    print("fff")
    return jsonify(message="Hello from Flask!")

@main.route('/dashboard', methods=['GET'])
def dashboard():
    print("k lok")
    return jsonify({
        "id": 123,
        "info": "Here is your dashboard",
        "time": int(time.time())  # Current time since epoch in seconds
    })

@main.route('/ticker', methods=['GET'])
def ticker():
    print("ticker called lol")

    # Assuming the ticker symbol is passed as a query parameter
    ticker_symbol = request.args.get('symbol', default='AAPL', type=str)

    data = ticker_data.get_ticker_data(ticker_symbol)

    return jsonify({
        "id": 456,
        "time": int(time.time()),
        "ticker_data": data
    })
