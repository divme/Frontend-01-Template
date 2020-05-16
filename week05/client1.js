const net = require('net');

const client = net.createConnection({
  host: '127.0.0.1',
  port: 6066
}, () => {
  console.log('connected to server!');
  client.write('POST / HTTP/1.1\r\n');
  client.write('Host: 127.0.0.1\r\n');
  client.write('Content-Length: 21\r\n');
  client.write('Content-Type: application/x-www-form-urlencoded\r\n');
  client.write('\r\n');
  client.write('field1=aaa&code=x%3D1\r\n');
})
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
})
client.on('end', () => {
  console.log('disconnected from server');
})
