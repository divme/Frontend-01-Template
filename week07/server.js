const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(`
    <html>
    <body>
     <h5>我是小宇</h5>
    </body>
    </html>
  `);
});
server.listen(6066);
