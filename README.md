# robinhood-clone


To run this app, you will need to run the React App Locally + the Flask App Locally.

First, create a venv.

Then activate it:
venv\Scripts\activate.bat
source venv/bin/activate

Then you will need to commands shells to run the React App + the Flask App:
In the client/ directory use:
```
npm start
```

In the server/directory use:
```
set FLASK_APP=app
set FLASK_ENV=development
flask run
```