import time
import json
import sys
import requests
from requests.sessions import Session
from threading import local
from concurrent.futures import ThreadPoolExecutor

URL = 'http://localhost:5000/dashboard'

def send_request(transaction_id, params, session):
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

        r = session.post(URL, json=body)
    
    elif cmd == 'QUOTE':
        userid = args[0]
        stockSymbol = args[1]

        body = {
            'userid': userid,
            'nextTransactionNum': transaction_id,
            'StockSymbol': stockSymbol
        }

        r = session.post(URL, json=body)
    
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
        
        r = session.post(URL, json=body)
    
    elif cmd == 'COMMIT_BUY':
        userid = args[0]

        body = {
            'userid': userid,
            'nextTransactionNum': transaction_id,
        }

        r = session.post(URL, json=body)
    
    elif cmd == 'CANCEL_BUY':
        userid = args[0]

        body = {
            'userid': userid,
            'nextTransactionNum': transaction_id,
        }

        r = session.post(URL, json=body)
    
    elif cmd == 'SELL':
        userid = args[0]
        stockSymbol = args[1]
        amount = args[2]

        body = {
            'userid': userid,
            'nextTransactionNum': transaction_id,
            'StockSymbol': stockSymbol,
            'amount': float(amount)
        }
        URL = API_URI + '/sell'

    
    elif cmd == 'COMMIT_SELL':
        userid = args[0]

        body = {
            'userid': userid,
            'nextTransactionNum': transaction_id,
        }

        r = session.post(URL, json=body)
    
    elif cmd == 'CANCEL_SELL':
        userid = args[0]

        body = {
            'userid': userid,
            'nextTransactionNum': transaction_id,
        }

        r = session.post(URL, json=body)
    
    elif cmd == 'SET_BUY_AMOUNT':

        userid = args[0]
        stockSymbol = args[1]
        amount = args[2]

        body = {
            'userid' : userid,
            'nextTransactionNum': transaction_id,
            'StockSymbol' : stockSymbol,
            'amount': float(amount)
        }
        
        r = session.post(URL, json=body)

    elif cmd == 'CANCEL_SET_BUY':

        userid = args[0]
        stockSymbol = args[1]

        body = {
            'userid' : userid,
            'nextTransactionNum': transaction_id,
            'StockSymbol': stockSymbol
        }

        r = session.post(URL, json=body)

    elif cmd == 'SET_BUY_TRIGGER':

        userid = args[0]
        stockSymbol = args[1]
        amount = args[2]

        body = {
            'userid' : userid,
            'nextTransactionNum': transaction_id,
            'StockSymbol' : stockSymbol,
            'amount': float(amount)
        }

        r = session.post(URL, json=body)

    elif cmd == 'SET_SELL_AMOUNT':

        userid = args[0]
        stockSymbol = args[1]
        amount = args[2]

        body = {
            'userid' : userid,
            'nextTransactionNum': transaction_id,
            'StockSymbol' : stockSymbol,
            'amount': float(amount)
        }

        r = session.post(URL, json=body)

    elif cmd == 'SET_SELL_TRIGGER':

        userid = args[0]
        stockSymbol = args[1]
        amount = args[2]

        body = {
            'userid' : userid,
            'nextTransactionNum': transaction_id,
            'StockSymbol' : stockSymbol,
            'amount': float(amount)
        }

        r = session.post(URL, json=body)

    elif cmd == 'CANCEL_SET_SELL':

        userid = args[0]
        stockSymbol = args[1]

        body = {
            'userid' : userid,
            'nextTransactionNum': transaction_id,
            'StockSymbol' : stockSymbol
        }

        r = session.post(URL, json=body)

    elif cmd == 'DUMPLOG' and len(args) > 1:

        userid = args[0]
        filename = args[1]
        
        body = {
            'userid' : userid,
            'nextTransactionNum': transaction_id,
            'filename' : filename
        }

        r = session.post(URL, json=body) 

    elif cmd == 'DUMPLOG':

        filename = args[0]
        
        body = {
            'filename' : filename,
            'nextTransactionNum': transaction_id
        }

        r = session.post(URL, json=body)
     
    elif cmd == 'DISPLAY_SUMMARY':

        userid = args[0]
        
        body = {
            'userid' : userid,
            'nextTransactionNum': transaction_id,
        }

        r = session.post(URL, json=body)


def create_session(local_session) -> Session:
    if not hasattr(local_session, 'session'):
            local_session.session = Session()
    return local_session.session


def process_commands(transactions):
    with ThreadPoolExecutor(max_workers=10) as executor:
        # Use a local session object for each thread to prevent collisions
        # when accessing the API concurrently
        local_session = local()
        # Create a session with a connection pool to reuse TCP connections
        session = create_session(local_session)
        adapter = requests.adapters.HTTPAdapter(pool_connections=100, pool_maxsize=100)
        session.mount('http://', adapter)
        
        futures = []
        for transaction in transactions:
            print(transaction)
            transaction_id, params = transaction
            futures.append(
                executor.submit(send_request, transaction_id, params, session)
            )
        # Wait for all requests to complete
        for future in futures:
            future.result()


def main():
    if len(sys.argv) > 1:
        filename = sys.argv[1]
    else:
        print("You did not specify the name of a file to run. Using default - user1.txt")
        filename = './payloads/user1.txt'

    transactions = []
    with open(filename, 'r') as f:
        for line in f:
            transaction_id, params = line.strip().split(' ', 1)
            transaction_id = transaction_id[1:-1] # Remove square brackets
            params = params.split(',')
            transactions.append((transaction_id, params))

    start = time.perf_counter()
    process_commands(transactions)
    elapsed = time.perf_counter() - start
    print(f"Elapsed time: {elapsed:0.2f} seconds")

    return {
        'statusCode': 200,
        'body': json.dumps(f'Total Time {elapsed - start:0.2f}')
    }

if __name__ == '__main__':
    main()