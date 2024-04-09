import app.all_tickers
import boto3

ALL_TICKERS = set(app.all_tickers.all_tickers)

# Configure DynamoDB client to use DynamoDB Local
dynamodb = boto3.resource(
    'dynamodb',
    endpoint_url='http://localhost:8000', # DynamoDB Local URL
    region_name='us-west-2', # Example region
    aws_access_key_id='dummy', # Dummy credentials for DynamoDB Local
    aws_secret_access_key='dummy'
)

# Reference to the FullDB table
table = dynamodb.Table('FullDB')
