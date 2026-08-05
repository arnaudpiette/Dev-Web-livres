require('dotenv').config();

const http = require('http');
const app = require('./app');
const connectDatabase = require('./config/db');

const normalizePort = (value) => {
  const port = parseInt(value, 10);

  if (Number.isNaN(port)) {
    return value;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

const server = http.createServer(app);

const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;

  if (error.code === 'EACCES') {
    console.error(`${bind} requires elevated privileges.`);
    process.exit(1);
  }
  if (error.code === 'EADDRINUSE') {
    console.error(`${bind} is already in use.`);
    process.exit(1);
  }

  throw error;
};

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
  console.log(`Listening on ${bind}`);
});

connectDatabase()
  .then(() => {
    server.listen(port, () => {
      console.log(`Serveur disponible sur http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Connexion MongoDB impossible :', error);
    process.exit(1);
  });
