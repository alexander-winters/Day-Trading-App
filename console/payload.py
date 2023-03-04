import time
import json
import sys
import requests
from requests.sessions import Session
from threading import local
from concurrent.futures import ThreadPoolExecutor

API_URI = 'http://localhost:3000/dashboard'

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

        r = session.post(URL, json=body)
    
    elif cmd == 'QUOTE':
        userid = args[0]
        stockSymbol = args[1]

        body = {
            'userid': userid,
            'nextTransactionNum': transaction_id,
            'StockSymbol': stockSymbol
        }
        URL = API_URI + '/quote'

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
        URL = API_URI + '/buy'
        
        r = session.post(URL, json=body)
    
    elif cmd == 'COMMIT_BUY':
        userid = args[0]

        body = {
            'userid': userid,
            'nextTransactionNum': transaction_id,
        }
        URL = API_URI + '/commit_buy'

        r = session.post(URL, json=body)
    
    elif cmd == 'CANCEL_BUY':
        userid = args[0]

        body = {
            'userid': userid,
            'nextTransactionNum': transaction_id,
        }
        URL = API_URI + '/cancel_buy'

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

        r = session.post(URL, json=body)
    
    elif cmd == 'COMMIT_SELL':
        userid = args[0]

        body = {
            'userid': userid,
            'nextTransactionNum': transaction_id,
        }
        URL = API_URI + '/commit_sell'

        r = session.post(URL, json=body)
    
    elif cmd == 'CANCEL_SELL':
        userid = args[0]

        body = {
            'userid': userid,
            'nextTransactionNum': transaction_id,
        }
        URL = API_URI + '/cancel_sell'

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

        URL = API_URI + '/set_buy_amount'
        
        # r = requests.post(URL, json=body)
        r = session.post(URL, json=body)

    elif cmd == 'CANCEL_SET_BUY':

        userid = args[0]
        stockSymbol = args[1]

        body = {
            'userid' : userid,
            'nextTransactionNum': transaction_id,
            'StockSymbol': stockSymbol
        }

        URL = API_URI + '/cancel_set_buy'
        
        # r = requests.post(URL, json=body)
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

        URL = API_URI + '/set_buy_trigger'
        
        # r = requests.post(URL, json=body)
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

        URL = API_URI + '/set_sell_amount'
        
        # r = requests.post(URL, json=body)
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

        URL = API_URI + '/set_sell_trigger'
        
        # r = requests.post(URL, json=body)
        r = session.post(URL, json=body)

    elif cmd == 'CANCEL_SET_SELL':

        userid = args[0]
        stockSymbol = args[1]

        body = {
            'userid' : userid,
            'nextTransactionNum': transaction_id,
            'StockSymbol' : stockSymbol
        }

        URL = API_URI + '/cancel_set_sell'
        
        # r = requests.post(URL, json=body)
        r = session.post(URL, json=body)

    elif cmd == 'DUMPLOG' and len(args) > 1:

        userid = args[0]
        filename = args[1]
        
        body = {
            'userid' : userid,
            'nextTransactionNum': transaction_id,
            'filename' : filename
        }

        URL = API_URI + '/user_dumplog'
        
        # r = requests.post(URL, json=body)
        r = session.post(URL, json=body) 

    elif cmd == 'DUMPLOG':

        filename = args[0]
        
        body = {
            'filename' : filename,
            'nextTransactionNum': transaction_id
        }

        URL = API_URI + '/dumplog'
        # r = requests.post(URL, json=body)
        r = session.post(URL, json=body)
     
    elif cmd == 'DISPLAY_SUMMARY':

        userid = args[0]
        
        body = {
            'userid' : userid,
            'nextTransactionNum': transaction_id,
        }

        URL = API_URI + '/display_summary'
        
        # r = requests.post(URL, json=body)
        r = session.post(URL, json=body)



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
    if len(sys.argv) < 2:
        print("You did not specify the name of a file to run. Using default - user1.txt")
        filename = './payloads/user1.txt'
    
    filename = sys.argv[1]

    transactions = []
    with open(filename, 'r') as f:
        for line in f:
            transactions.append(line.strip().split(','))

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