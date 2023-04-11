module.exports = {
    apps: [
      {
        name: 'server',
        script: './server/server.js',
        instances: '8',
        exec_mode: 'cluster',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
      },
    ],
  };