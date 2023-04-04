module.exports = {
    apps: [
      {
        script: './server/server.js',
        instances: 2,
        exec_mode: 'cluster',
        args: '5001', // pass the desired port number for the first instance
        name: 'instance-5001',
      },
      {
        script: './server/server.js',
        instances: 2,
        exec_mode: 'cluster',
        args: '5002', // pass the desired port number for the second instance
        name: 'instance-5002',
      },
      {
        script: './server/server.js',
        instances: 2,
        exec_mode: 'cluster',
        args: '5003', // pass the desired port number for the first instance
        name: 'instance-5003',
      },
      {
        script: './server/server.js',
        instances: 2,
        exec_mode: 'cluster',
        args: '5004', // pass the desired port number for the second instance
        name: 'instance-5004',
      },
      {
        script: './server/server.js',
        instances: 2,
        exec_mode: 'cluster',
        args: '5005', // pass the desired port number for the first instance
        name: 'instance-5005',
      },
      {
        script: './server/server.js',
        instances: 2,
        exec_mode: 'cluster',
        args: '5006', // pass the desired port number for the second instance
        name: 'instance-5006',
      },
      {
        script: './server/server.js',
        instances: 2,
        exec_mode: 'cluster',
        args: '5007', // pass the desired port number for the first instance
        name: 'instance-5007',
      },
      {
        script: './server/server.js',
        instances: 2,
        exec_mode: 'cluster',
        args: '5008', // pass the desired port number for the second instance
        name: 'instance-5008',
      },
    ],
  };