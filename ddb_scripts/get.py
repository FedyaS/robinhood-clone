import boto3

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

# Specify the user's primary key (PK and SK)
user_pk = 'USER#ABCDEFGH'

# Perform the GetItem operation
try:
    response = table.get_item(
        Key={
            'PK': user_pk,
            'SK': user_pk  # Assuming PK and SK are the same for this user
        }
    )
    # Check if the item (user) was found
    if 'Item' in response:
        print(response['Item'])
    else:
        print("User not found.")
except Exception as e:
    print(f"An error occurred: {str(e)}")
