from flask import Blueprint, jsonify
from flask_cors import CORS
import time

main = Blueprint('main', __name__)
CORS(main)

@main.route('/')
def index():
    return jsonify(message="Hello from Flask!")

@main.route('/dashboard', methods=['GET'])
def dashboard():
    print("k lok")
    return jsonify({
        "id": 123,
        "info": "Here is your dashboard",
        "time": int(time.time())  # Current time since epoch in seconds
    })
