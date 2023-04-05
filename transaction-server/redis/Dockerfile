FROM redis:latest

# Copy the custom Redis configuration file
COPY redis.conf /usr/local/etc/redis/redis.conf

# Expose the Redis port
EXPOSE 6379

# Start the Redis server with the custom configuration
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]