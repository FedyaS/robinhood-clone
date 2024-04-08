import boto3
from botocore.exceptions import ClientError

def put_item_in_table(dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource(
            'dynamodb',
            endpoint_url="http://localhost:8000",
            region_name='us-west-2',
            aws_access_key_id='fakeMyKeyId',
            aws_secret_access_key='fakeSecretAccessKey'
        )

    table = dynamodb.Table('FullDB')

    # Replace this with the JSON object you want to insert
    # Ensure this object contains at least the PK and SK attributes
    json_object = {
        "PK": "USER#ABCDEFGH",
        "SK": "USER#ABCDEFGH",
        "id": "ABCDEFGH",
        "name": "John Doe",
        "cash": 50000, # Represents $500.00
        "type": "USER"
    }


    try:
        response = table.put_item(Item=json_object)
        print("Item inserted successfully:", response)
    except ClientError as e:
        print("Failed to insert item:", e)

if __name__ == '__main__':
    put_item_in_table()
