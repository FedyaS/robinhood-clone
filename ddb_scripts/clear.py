import boto3

# Configure DynamoDB client to use DynamoDB Local
dynamodb = boto3.resource(
    'dynamodb',
    endpoint_url='http://localhost:8000',  # DynamoDB Local URL
    region_name='us-west-2',  # Example region
    aws_access_key_id='dummy',  # Dummy credentials for DynamoDB Local
    aws_secret_access_key='dummy'
)

# Reference to the FullDB table
table = dynamodb.Table('FullDB')

# Scan the table - Note: This is not recommended for large tables in production
try:
    response = table.scan()
    items = response.get('Items', [])
    
    # Loop through the items and delete each one
    for item in items:
        pk = item['PK']
        sk = item['SK']
        delete_response = table.delete_item(
            Key={
                'PK': pk,
                'SK': sk
            }
        )
        print(f"Deleted item: PK={pk}, SK={sk}")
        
    print("All items cleared.")
except Exception as e:
    print(f"An error occurred: {str(e)}")
