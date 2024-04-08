import random
import string
import boto3
from boto3.dynamodb.conditions import Key

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


def generate_id():
    """Generates an 8-letter uppercase ID."""
    return ''.join(random.choices(string.ascii_uppercase, k=8))

def get_user(user_id):
    # Construct the PK and SK value from the user_id
    pk = sk = f"USER#{user_id}"

    try:
        # Attempt to get the item from the DynamoDB table
        response = table.get_item(
            Key={
                'PK': pk,
                'SK': sk
            }
        )
    except Exception as e:
        # Handle potential errors
        print(f"Error fetching user: {e}")
        return None

    # Check if item was found and return unmarshalled item
    item = response.get('Item', None)
    if item:
        # No need to manually unmarshall; boto3 does it automatically here
        return item
    else:
        return None

def get_stock_order(user_id, stock_order_id):
    # Construct the PK with the user_id and the SK with the stock_order_id
    pk = f"USER#{user_id}"
    sk = f"STOCK_ORDER#{stock_order_id}"

    try:
        # Attempt to get the stock order from the DynamoDB table
        response = table.get_item(
            Key={
                'PK': pk,
                'SK': sk
            }
        )
    except Exception as e:
        # Handle potential errors
        print(f"Error fetching stock order: {e}")
        return None

    # Check if item was found and return unmarshalled item
    item = response.get('Item', None)
    if item:
        # No need to manually unmarshall; boto3 does it automatically here
        return item
    else:
        return None


def query_user_stock(user_id):
    # Construct the PK value from the user_id
    pk = f"USER#{user_id}"
    sk_prefix = "STOCK#"

    try:
        # Use the query method to fetch items with a specific PK and SK starting with sk_prefix
        response = table.query(
            KeyConditionExpression=Key('PK').eq(pk) & Key('SK').begins_with(sk_prefix)
        )
    except Exception as e:
        # Handle potential errors
        print(f"Error querying user stock: {e}")
        return None

    # Retrieve and return the items from the response
    items = response.get('Items', [])
    if items:
        # No need to manually unmarshall; boto3 does it automatically here
        return items
    else:
        return None

def put_order(user_id, order_id, ticker, num_shares, max_price, cash_allotted):
    client = dynamodb.meta.client
    user_pk = f'USER#{user_id}'
    stock_order_sk = f'STOCK_ORDER#{order_id}'
    
    order = {
        "PK": user_pk,
        "SK": stock_order_sk,
        "id": order_id,
        "ticker": ticker,
        "num_shares": num_shares,
        "max_price_per_share": max_price,
        "cash_allotted": cash_allotted,
        "purchase_price_per_share": 0,
        "status": 'PROCESSING',
        "type": 'STOCK_ORDER'
    }
    
    try:
        # Start a transaction
        response = client.transact_write_items(
            TransactItems=[
                {
                    'Put': {
                        'TableName': 'FullDB',
                        'Item': {
                            'PK': {'S': order['PK']},
                            'SK': {'S': order['SK']},
                            'id': {'S': order['id']},
                            'ticker': {'S': order['ticker']},
                            'num_shares': {'N': str(order['num_shares'])},
                            'max_price_per_share': {'N': str(order['max_price_per_share'])},
                            'cash_allotted': {'N': str(order['cash_allotted'])},
                            'purchase_price_per_share': {'N': str(order['purchase_price_per_share'])},
                            'status': {'S': order['status']},
                            'type': {'S': order['type']}
                        }
                    }
                },
                {
                    'Update': {
                        'TableName': 'FullDB',
                        'Key': {
                            'PK': {'S': user_pk},
                            'SK': {'S': user_pk}
                        },
                        'UpdateExpression': 'SET cash_balance = cash_balance - :ca',
                        'ConditionExpression': 'cash_balance >= :ca',
                        'ExpressionAttributeValues': {
                            ':ca': {'N': str(cash_allotted)}
                        },
                        'ReturnValuesOnConditionCheckFailure': 'ALL_OLD'
                    }
                }
            ]
        )
    except client.exceptions.TransactionCanceledException as e:
        print(f"Transaction failed: {e}")
        return None
    except Exception as e:
        print(f"Error processing order: {e}")
        return None

    return order

