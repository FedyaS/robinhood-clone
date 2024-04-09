import boto3
from botocore.exceptions import ClientError

def create_dynamodb_table(dynamodb=None):
    if not dynamodb:
        # Initialize a DynamoDB client with a local endpoint
        dynamodb = boto3.resource(
            'dynamodb',
            endpoint_url="http://localhost:8000",
            region_name='us-west-2',
            aws_access_key_id='dummy',
            aws_secret_access_key='dummy'
        )

    table_name = 'FullDB'

    try:
        # Attempt to create the table
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=[
                {
                    'AttributeName': 'PK',
                    'KeyType': 'HASH'  # Partition key
                },
                {
                    'AttributeName': 'SK',
                    'KeyType': 'RANGE'  # Sort key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'PK',
                    'AttributeType': 'S'  # String type
                },
                {
                    'AttributeName': 'SK',
                    'AttributeType': 'S'  # String type
                },
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 10,
                'WriteCapacityUnits': 10
            }
        )
        table.wait_until_exists()
        print(f"Table {table_name} created successfully.")
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print(f"Table {table_name} already exists. No action taken.")
        else:
            raise

if __name__ == '__main__':
    create_dynamodb_table()
