import time
import json
import sys
import re
import asyncio
import httpx
import statistics
from collections import defaultdict

URL = 'http://localhost:80/dashboard'
cmds = ['ADD', 'QUOTE', 'BUY', 'COMMIT_BUY', 'CANCEL_BUY', 'SELL', 'COMMIT_SELL', 'CANCEL_SELL', 'SET_BUY_AMOUNT',
        'CANCEL_SET_BUY', 'SET_BUY_TRIGGER', 'SET_SELL_AMOUNT', 'SET_SELL_TRIGGER', 'CANCEL_SET_SELL', 'DUMPLOG', 'DISPLAY_SUMMARY']

request_times = {cmd: [] for cmd in cmds}
response_times = {cmd: [] for cmd in cmds}

async def send_request(transaction_id, params, session):
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

        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)

    
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

        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)
    
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
        
        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)
    
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

        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)
    
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

        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)
    
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

        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)
    
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

        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)
    
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

        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)
    
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
        
        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)

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

        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)

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

        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)

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

        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)

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

        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)

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

        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)

    elif cmd == 'DUMPLOG' and len(args) > 1:
        print("DUMPLOG")
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

        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)

    elif cmd == 'DUMPLOG':
        print("DUMPLOG")

        filename = args[0]
        
        body = {
            'type': 'dumplog',
            'user': None,
            'transaction_id': transaction_id,
            'stock_symbol': None,
            'amount': None,
            'filename': filename
        }

        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)
     
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

        try:
            r = await session.post(URL, json=body, timeout=5.0)  # Set a custom timeout here, e.g., 5 seconds
            request_times[cmd].append(time.perf_counter() - request_start)
            request_sent = time.perf_counter()
        except httpx.ReadTimeout:
            print(f"Request for transaction {transaction_id} timed out. Retrying...")
            return await send_request(transaction_id, params, session)
        if r:
            response_times[cmd].append(request_sent - request_start)

def group_transactions_by_user(transactions):
    user_transactions = defaultdict(list)
    for transaction_id, params in transactions:
        user = params[1]
        user_transactions[user].append((transaction_id, params))
    return user_transactions


async def process_user_commands(user_transactions, session):
    for transaction_id, params in user_transactions:
        print(transaction_id, params)
        await send_request(transaction_id, params, session)


async def process_commands(transactions):
    async with httpx.AsyncClient() as session:
        user_transactions = group_transactions_by_user(transactions)
        tasks = [process_user_commands(transactions, session) for transactions in user_transactions.values()]
        await asyncio.gather(*tasks)


async def main():
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

    start = time.perf_counter()
    await process_commands(transactions)
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
    asyncio.run(main())