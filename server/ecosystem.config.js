module.exports = {
    apps: [
      {
        name: 'server',
        script: './server/server.js',
        instances: max,
        exec_mode: 'cluster',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          PORT: 5000,
        },
      },
    ],
  };