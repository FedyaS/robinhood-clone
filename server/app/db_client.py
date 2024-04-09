import random
import string
import time
from boto3.dynamodb.conditions import Key
from decimal import Decimal
from app.constants import dynamodb, table

def generate_id():
    """Generates an 8-letter uppercase ID."""
    return ''.join(random.choices(string.ascii_uppercase, k=8))

def get_item(pk, sk):
    print(f'get_item for {pk}, {sk}')
    try:
        # Attempt to get the item from the DynamoDB table
        response = table.get_item(
            Key={'PK': pk, 'SK': sk}
        )
    except Exception as e:
        # Handle potential errors
        print(f"Error fetching item: {e}")
        return None

    item = response.get('Item', None)
    if item:
        # No need to manually unmarshall; boto3 does it automatically here
        return item
    else:
        return None


def get_user(user_id):
    # Construct the PK and SK value from the user_id
    pk = sk = f"USER#{user_id}"

    return get_item(pk, sk)

def get_stock_order(user_id, stock_order_id):
    # Construct the PK with the user_id and the SK with the stock_order_id
    pk = f"USER#{user_id}"
    sk = f"STOCK_ORDER#{stock_order_id}"

    return get_item(pk, sk)

def get_stock(user_id, ticker):
    pk = f"USER#{user_id}"
    sk = f"STOCK#{ticker}"

    return get_item(pk, sk)
    
def query_user_info(user_id):
    pk = f"USER#{user_id}"

    try:
        response = table.query(
            KeyConditionExpression=Key('PK').eq(pk)
        )
    except Exception as e:
        print(f"Error querying user info: {e}")
        return None
    
    items = response.get('Items', [])
    if items:
        stocks = []
        orders = []
        user = {}
        
        for itm in items:
            if itm['type'] == 'STOCK':
                stocks.append(itm)
            elif itm['type'] == 'STOCK_ORDER':
                orders.append(itm)
            elif itm['type'] == 'USER':
                user = itm

        return user, stocks, orders
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

def transact_write(operations):
    client = dynamodb.meta.client
    
    print(f"transact_write for {len(operations)} items")
    try:
        client.transact_write_items(
            TransactItems=operations
        )
        print("Transaction successful.")
        return True
    except Exception as e:
        print(f"Transaction failed: {e}")
        return False

def put_order(user_id, order_id, ticker, num_shares, max_price, cash_allotted):
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
        "filled_price_per_share": 0,
        "status": 'PROCESSING',
        "subtype": 'BUY',
        "type": 'STOCK_ORDER'
    }
    
    put_order = {
                    'Put': {
                        'TableName': 'FullDB',
                        'Item': order
                    }
                }
    
    update_user = {
                    'Update': {
                        'TableName': 'FullDB',
                        'Key': {
                            'PK': user_pk,
                            'SK': user_pk
                        },
                        'UpdateExpression': 'SET cash = cash - :ca',
                        'ConditionExpression': 'cash >= :ca',
                        'ExpressionAttributeValues': {
                            ':ca': cash_allotted
                        }
                    }
                }

    res = transact_write([put_order, update_user])
    if res:
        return order
    else:
        return None


def put_sell_order(user_id, order_id, ticker, num_shares, min_price, cash_allotted):
    user_pk = f'USER#{user_id}'
    stock_order_sk = f'STOCK_ORDER#{order_id}'
    stock_sk = f'STOCK#{ticker}'

    order = {
        "PK": user_pk,
        "SK": stock_order_sk,
        "id": order_id,
        "ticker": ticker,
        "num_shares": num_shares,
        "min_price_per_share": min_price,
        "cash_allotted": cash_allotted,
        "filled_price_per_share": 0,
        "status": 'PROCESSING',
        "subtype": 'SELL',
        "type": 'STOCK_ORDER'
    }
    
    # Make an order Object
    put_order = {
                    'Put': {
                        'TableName': 'FullDB',
                        'Item': order
                    }
                }
    
    # Deduct Sold Shares
    update_stock = {
                    'Update': {
                        'TableName': 'FullDB',
                        'Key': {
                            'PK': user_pk,
                            'SK': stock_sk
                        },
                        'UpdateExpression': 'SET num_shares = num_shares - :numShares',
                        'ConditionExpression': 'num_shares >= :numShares',
                        'ExpressionAttributeValues': {
                            ':numShares': num_shares
                        }
                    }
                }
    
    res = transact_write([put_order, update_stock])
    if res:
        return order
    else:
        return None
    

def cancel_order(user_id, order_id, cash_allotted):
    # Add the cash_allotted back into the user object cash field
    # Update the order object status to CANCELLED

    user_pk = f"USER#{user_id}"
    order_sk = f"STOCK_ORDER#{order_id}"

    update_user = {
        'Update': {
            'TableName': 'FullDB',
            'Key': {
                'PK': user_pk,
                'SK': user_pk
            },
            'UpdateExpression': 'SET cash = cash + :cashReturned',
            'ExpressionAttributeValues': {
                ':cashReturned': Decimal(cash_allotted)
            }
        }
    }

    update_stock_order = {
        'Update': {
            'TableName': 'FullDB',
            'Key': {
                'PK': user_pk,
                'SK': order_sk
            },
            'UpdateExpression': 'SET #status = :cancelledStatus',
            'ExpressionAttributeValues': {
                ':cancelledStatus': 'CANCELLED'
            },
            'ExpressionAttributeNames': {
                '#status': 'status'
            }
        }
    }
 
    transact_write([update_user, update_stock_order])

    return

def cancel_sell_order(user_id, order_id, ticker, shares_returned):
    user_pk = f"USER#{user_id}"
    order_sk = f"STOCK_ORDER#{order_id}"
    stock_sk = f"STOCK#{ticker}"

    # Add the num_shares back into the user stock num_shares field
    update_stock = {
        'Update': {
            'TableName': 'FullDB',
            'Key': {
                'PK': user_pk,
                'SK': stock_sk
            },
            'UpdateExpression': 'SET num_shares = num_shares + :numShares',
            'ExpressionAttributeValues': {
                ':numShares': shares_returned
            }
        }
    }

    # Update the order object status to CANCELLED
    update_stock_order = {
        'Update': {
            'TableName': 'FullDB',
            'Key': {
                'PK': user_pk,
                'SK': order_sk
            },
            'UpdateExpression': 'SET #status = :cancelledStatus',
            'ExpressionAttributeValues': {
                ':cancelledStatus': 'CANCELLED'
            },
            'ExpressionAttributeNames': {
                '#status': 'status'
            }
        }
    }
 
    transact_write([update_stock, update_stock_order])

    return

def finish_order(user_id, order_id, returned_cash, ticker, last_price, num_shares):
    user_pk = f"USER#{user_id}"
    order_sk = f"STOCK_ORDER#{order_id}"

    # Prepare the update expression for the USER item
    update_user = {
        'Update': {
            'TableName': 'FullDB',
            'Key': {
                'PK': user_pk,
                'SK': user_pk
            },
            'UpdateExpression': 'SET cash = cash + :cashReturned',
            'ExpressionAttributeValues': {
                ':cashReturned': Decimal(returned_cash)
            }
        }
    }

    # Prepare the update expression for the STOCK_ORDER item
    update_stock_order = {
        'Update': {
            'TableName': 'FullDB',
            'Key': {
                'PK': user_pk,
                'SK': order_sk
            },
            'UpdateExpression': 'SET #status = :statusCompleted, filled_price_per_share = :lastPrice',
            'ExpressionAttributeValues': {
                ':statusCompleted': 'COMPLETED',
                ':lastPrice': last_price
            },
            'ExpressionAttributeNames': {
                '#status': 'status'
            }
        }
    }

    operations = [update_user, update_stock_order]

    current_stock = get_stock(user_id, ticker)
    if current_stock:
        # If the stock exists, prepare an update operation
        update_stock = {
            'Update': {
                'TableName': 'FullDB',
                'Key': {
                    'PK': f"USER#{user_id}",
                    'SK': f"STOCK#{ticker}"
                },
                'UpdateExpression': 'SET num_shares = num_shares + :numShares, last_price = :lastPrice',
                'ExpressionAttributeValues': {
                    ':numShares': num_shares,
                    ':lastPrice': last_price
                }
            }
        }
        operations.append(update_stock)
    else:
        # If the stock does not exist, prepare a create operation
        create_stock = {
            'Put': {
                'TableName': 'FullDB',
                'Item': {
                    'PK': f"USER#{user_id}",
                    'SK': f"STOCK#{ticker}",
                    'user_id': user_id,
                    'ticker': ticker,
                    'num_shares': num_shares,
                    'last_price': last_price,
                    'datetime': Decimal(time.time()),
                    'type': 'STOCK'
                }
            }
        }
        operations.append(create_stock)


    transact_write(operations)

    return

def finish_sell_order(user_id, order_id, last_price, cash_influx):
    user_pk = f"USER#{user_id}"
    order_sk = f"STOCK_ORDER#{order_id}"

    # Add cash to user's account
    update_user = {
        'Update': {
            'TableName': 'FullDB',
            'Key': {
                'PK': user_pk,
                'SK': user_pk
            },
            'UpdateExpression': 'SET cash = cash + :cashInflux',
            'ExpressionAttributeValues': {
                ':cashInflux': cash_influx
            }
        }
    }

    # Mark the STOCK_ORDER as completed and set the purchase price
    update_stock_order = {
        'Update': {
            'TableName': 'FullDB',
            'Key': {
                'PK': user_pk,
                'SK': order_sk
            },
            'UpdateExpression': 'SET #status = :statusCompleted, filled_price_per_share = :lastPrice',
            'ExpressionAttributeValues': {
                ':statusCompleted': 'COMPLETED',
                ':lastPrice': last_price
            },
            'ExpressionAttributeNames': {
                '#status': 'status'
            }
        }
    }

    transact_write([update_user, update_stock_order])

    return
