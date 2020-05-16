const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  console.log('I am working');
  res.end('OK! I am fine !');
})
server.listen(6066);
