const path = require('node:path');
const ejs = require('ejs');

const VIEWS_DIR = path.join(__dirname, '../../views');

function render(res, view, data = {}) {
  const filePath = path.join(VIEWS_DIR, `${view}.ejs`);
  ejs.renderFile(filePath, data, (err, str) => {
    if (err) {
      console.error('Error rendering template:', err);
      return sendError(res, 500, 'Erreur interne du serveur lors du rendu.');
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(str);
  });
}

function redirect(res, url) {
  res.writeHead(302, { Location: url });
  res.end();
}

function sendError(res, code, message) {
  res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8' });
  render(res, 'error', { code, message });
}

module.exports = { render, redirect, sendError };