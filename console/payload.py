import time
import json
import sys
import os
import requests
from requests.sessions import Session
from threading import local
from concurrent.futures import ThreadPoolExecutor
import statistics

URL = 'http://localhost:80/dashboard'
cmds = ['ADD', 'QUOTE', 'BUY', 'COMMIT_BUY', 'CANCEL_BUY', 'SELL', 'COMMIT_SELL', 'CANCEL_SELL', 'SET_BUY_AMOUNT',
        'CANCEL_SET_BUY', 'SET_BUY_TRIGGER', 'SET_SELL_AMOUNT', 'SET_SELL_TRIGGER', 'CANCEL_SET_SELL', 'DUMPLOG', 'DISPLAY_SUMMARY']

request_times = {cmd: [] for cmd in cmds}
response_times = {cmd: [] for cmd in cmds}

def send_request(transaction_id, params, session):
    cmd = params[0]
    args = params[1:]

    request_start = time.perf_counter()

    if cmd == 'ADD':
        userid = args[0]
        amount = args[1]

        body = {
            'type': 'add',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': None,
            'amount': float(amount),
            'filename': None
        }

        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)

    
    elif cmd == 'QUOTE':
        userid = args[0]
        stock_symbol = args[1]

        body = {
            'type': 'quote',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': stock_symbol,
            'amount': None,
            'filename': None
        }

        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)
    
    elif cmd == 'BUY':
        userid = args[0]
        stock_symbol = args[1]
        amount = args[2]

        body = {
            'type': 'buy',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': stock_symbol,
            'amount': float(amount),
            'filename': None
        }
        
        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)
    
    elif cmd == 'COMMIT_BUY':
        userid = args[0]

        body = {
            'type': 'commit_buy',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': None,
            'amount': None,
            'filename': None
        }

        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)
    
    elif cmd == 'CANCEL_BUY':
        userid = args[0]

        body = {
            'type': 'cancel_buy',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': None,
            'amount': None,
            'filename': None
        }

        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)
    
    elif cmd == 'SELL':
        userid = args[0]
        stock_symbol = args[1]
        amount = args[2]

        body = {
            'type': 'sell',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': stock_symbol,
            'amount': float(amount),
            'filename': None
        }

        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)
    
    elif cmd == 'COMMIT_SELL':
        userid = args[0]

        body = {
            'type': 'commit_sell',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': None,
            'amount': None,
            'filename': None
        }

        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)
    
    elif cmd == 'CANCEL_SELL':
        userid = args[0]

        body = {
            'type': 'cancel_sell',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': None,
            'amount': None,
            'filename': None
        }

        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)
    
    elif cmd == 'SET_BUY_AMOUNT':

        userid = args[0]
        stock_symbol = args[1]
        amount = args[2]

        body = {
            'type': 'set_buy_amount',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': stock_symbol,
            'amount': float(amount),
            'filename': None
        }
        
        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)

    elif cmd == 'CANCEL_SET_BUY':

        userid = args[0]
        stock_symbol = args[1]

        body = {
            'type': 'cancel_set_buy',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': stock_symbol,
            'amount': None,
            'filename': None
        }

        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)

    elif cmd == 'SET_BUY_TRIGGER':

        userid = args[0]
        stock_symbol = args[1]
        amount = args[2]

        body = {
            'type': 'set_buy_trigger',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': stock_symbol,
            'amount': float(amount),
            'filename': None
        }

        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)

    elif cmd == 'SET_SELL_AMOUNT':

        userid = args[0]
        stock_symbol = args[1]
        amount = args[2]

        body = {
            'type': 'set_sell_amount',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': stock_symbol,
            'amount': float(amount),
            'filename': None
        }

        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)

    elif cmd == 'SET_SELL_TRIGGER':

        userid = args[0]
        stock_symbol = args[1]
        amount = args[2]

        body = {
            'type': 'set_sell_trigger',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': stock_symbol,
            'amount': float(amount),
            'filename': None
        }

        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)

    elif cmd == 'CANCEL_SET_SELL':

        userid = args[0]
        stock_symbol = args[1]

        body = {
            'type': 'cancel_set_sell',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': stock_symbol,
            'amount': None,
            'filename': None
        }

        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)

    elif cmd == 'DUMPLOG' and len(args) > 1:

        userid = args[0]
        filename = args[1]
        
        body = {
            'type': 'dumplog_file',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': None,
            'amount': None,
            'filename': filename
        }

        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)

    elif cmd == 'DUMPLOG':

        filename = args[0]
        
        body = {
            'type': 'dumplog',
            'user': None,
            'transaction_id': transaction_id,
            'stock_symbol': None,
            'amount': None,
            'filename': filename
        }

        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)
     
    elif cmd == 'DISPLAY_SUMMARY':

        userid = args[0]
        
        body = {
            'type': 'display_summary',
            'user': userid,
            'transaction_id': transaction_id,
            'stock_symbol': None,
            'amount': None,
            'filename': None
        }

        r = session.post(URL, json=body)
        request_times[cmd].append(time.perf_counter() - request_start)
        if r:
            response_times[cmd].append(time.perf_counter() - request_start)


def create_session(local_session) -> Session:
    if not hasattr(local_session, 'session'):
            local_session.session = Session()
    return local_session.session


def process_commands(transactions, max_workers):
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Use a local session object for each thread to prevent collisions
        # when accessing the API concurrently
        local_session = local()
        # Create a session with a connection pool to reuse TCP connections
        session = create_session(local_session)
        adapter = requests.adapters.HTTPAdapter(pool_connections=45, pool_maxsize=45)
        session.mount('http://', adapter)
        
        for transaction in transactions:
            print(transaction)
            transaction_id, params = transaction
            
            future = executor.submit(send_request, transaction_id, params, session)
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
            transaction_id = transaction_id[1:-1]  # Remove square brackets
            params = params.split(',')
            transactions.append((transaction_id, params))

    max_workers = os.cpu_count()

    start = time.perf_counter()
    process_commands(transactions, max_workers)
    elapsed = time.perf_counter() - start
    print(f"Elapsed time: {elapsed:0.2f} seconds")

    for cmd in cmds:
        if request_times[cmd]:
            print(f"Avg Req Time for {cmd}: {statistics.fmean(request_times[cmd])}")
        if response_times[cmd]:
            print(f"Avg Res Time for {cmd}: {statistics.fmean(response_times[cmd])}")

    return {
        'statusCode': 200,
        'body': json.dumps(f'Total Time {elapsed - start:0.2f}')
    }

if __name__ == '__main__':
    main()