module.exports = {
  apps: [
    {
      name: 'yanolja-eezy-api',
      cwd: '/var/www/yanolja-cunt-eezy/backend',
      script: 'dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'yanolja-eezy-front',
      cwd: '/var/www/yanolja-cunt-eezy/frontend',
      script: 'node_modules/serve/build/main.js',
      args: '-s build -l tcp://127.0.0.1:5080',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
