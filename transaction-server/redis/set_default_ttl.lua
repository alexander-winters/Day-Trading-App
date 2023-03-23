-- Define a Lua function to set the default TTL for each key.
local function set_default_ttl(key)
    redis.call('EXPIRE', key, 240)
 end
 
 -- Set the default TTL for new keys by intercepting the SET command.
 redis.set = function(...)
    local result = { redis.pcall('SET', ...) }
    set_default_ttl(arg[1])
    return unpack(result)
 end