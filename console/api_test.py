import time
import json
import os
import requests
from requests.sessions import Session
from threading import local
from concurrent.futures import ThreadPoolExecutor

API_URI = 'http://localhost:3000'

# Create a session with a connection pool to reuse TCP connections
session = Session()
adapter = requests.adapters.HTTPAdapter(pool_connections=100, pool_maxsize=100)
session.mount('http://', adapter)

def send_request(transaction_id, params):
    cmd = params[0]
    args = params[1:]

    if cmd == 'ADD':
        userid = args[0]
        amount = args[1]

        body = {
            'userid': userid,
            'nextTransactionNum': transaction_id,
            'amount': float(amount)
        }
        URL = API_URI + '/add'
    elif cmd == 'QUOTE':
        userid = args[0]
        stockSymbol = args[1]

        body = {
            'userid': userid,
            'nextTransactionNum': transaction_id,
            'StockSymbol': stockSymbol
        }
        URL = API_URI + '/quote'
    elif cmd == 'BUY':
        userid = args[0]
        stockSymbol = args[1]
        amount = args[2]

        body = {
            'userid': userid,
            'nextTransactionNum': transaction_id,
            'StockSymbol': stockSymbol,
            'amount': float(amount)
        }



def process_commands(transactions):
    with ThreadPoolExecutor(max_workers=10) as executor:
        # Use a local session object for each thread to prevent collisions
        # when accessing the API concurrently
        local_session = local()
        futures = []
        for transaction in transactions:
            transaction_id, params = transaction
            futures.append(
                executor.submit(send_request, transaction_id, params, local_session)
            )
        # Wait for all requests to complete
        for future in futures:
            future.result()


def main():
    transactions = []
    with open('commands.json', 'r') as f:
        data = json.load(f)
        transactions = data['transactions']

    start = time.perf_counter()
    process_commands(transactions)
    elapsed = time.perf_counter() - start
    print(f"Elapsed time: {elapsed:0.2f} seconds")

if __name__ == '__main__':
    main()