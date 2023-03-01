import time
import json
import requests
from threading import local
from concurrent.futures import ThreadPoolExecutor

def process_commands(transactions):
    with ThreadPoolExecutor(max_workers=10) as executor:
        # Use a local session object for each thread to prevent collisions
        # when accessing the API concurrently
        local_session = local()
        futures = []
        for transaction in transactions:
            transaction_num, params = transaction
            futures.append(
                executor.submit(send_request, transaction_num, params, local_session)
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