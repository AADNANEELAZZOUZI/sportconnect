require('dotenv').config();
const http = require('node:http');
const path = require('node:path');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const router = require('find-my-way')();
const { render, sendError } = require('./src/core/renderer');

const serve = serveStatic(path.join(__dirname, 'public'));

router.on('GET', '/', (req, res) => {
  render(res, 'home');
});

const server = http.createServer((req, res) => {
  serve(req, res, () => {
    router.lookup(req, res);
  });
});

router.defaultRoute = (req, res) => {
  sendError(res, 404, 'Page introuvable');
};

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});