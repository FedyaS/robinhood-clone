# robinhood-clone
This is a basic robinhood-clone that allows users to research, buy, and sell stocks.

## pre-requistes for running
This app uses React, Flask, and DynamoDB Local.
You will need Node, Python, and Docker for everything to work.

## first-time setup
### Setup Python
1. `cd server`
1. `python -m venv`
1. Windows - `venv\Scripts\activate.bat` OR Mac - `source venv/bin/activate`
1. `pip3 install -r requirements.txt`

### Setup React
1. `cd client` (from the Project Directory)
1. `npm i`

### Setup DynamoDB Local
1. `docker pull amazon/dynamodb-local`
1. `docker run -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb`
1. `cd ./ddb_scripts` (from the Project Directory)
1. `python3 create_ddb.py` (with Venv)
1. `python3 put.py`

## running
Client:
1. `cd client`
1. `npm start`

Backend:
1. `cd server`
1. `set FLASK_APP=app`
1. `set FLASK_ENV=development`
1. `flask run`