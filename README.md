# Day-Trading-App

## Running the containers
To run the containers, please open a terminal then
~~~
$ docker compose up
~~~

## Running the payloads
1. To run the payloads, ensure that the containers are up and running
2. Open a terminal
3. Go to console directory by
~~~
$ cd console
~~~
4. Run the python script and pass the desired payload. For example
~~~
$ python3 payload.py payloads/user1.txt
~~~
6. Generate the dumplog by running:
~~~
$ python3 payload.py payloads/dumplog.txt
~~~
## Client 
To open the client <br>
1. Ensure the containers are up and running
2. Open in the browser: http://localhost:5173 

## Database
To see the database contents <br>
1. Download and install MongoDB Compass
2. Open the application then create new connection
3. In the URI input
~~~
mongodb://localhost:27017/test
~~~

## Performance Test
1. Download and install JMeter
2. Open the `load-test.jmx` or `stress test.jmx` from the `performance-test` folder
3. Start the test by clicking on the `Start` button in GUI

## Unit Tests
Please see the documentation on `transaction-server` folder
