const http = require('http')

const server = http.createServer((req, res) => {
  console.log('recieve req', req.headers)
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('X-Name', 'omo')
  res.writeHead(200, {'Contnet-Type': 'text/plain'})
  res.end(`
    <html name = a>
    <head>
        <style>
        body main #my {
        width: 100px;
        height: 30px;
        background-color: #ff5000;
        }
        body main div {
        width: 30px;
        height: 30px;
        background-color: #ff1111;
        }
    </style>
    </head>
    <body>
      <main>
        <p id='my'></p>
        <div/>
      </main>
    </body>
    </html>
    `)
})

server.listen(6066)