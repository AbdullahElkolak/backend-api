require('babel-core/register');
require('babel-polyfill');

// Instantiate server, then start it.
const Server = require('./api/server/server.js').default;
const serverInstance = new Server();
serverInstance.start();
