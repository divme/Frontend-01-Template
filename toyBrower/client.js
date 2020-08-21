// 1. http 请求
// 2. parse html
// 3. computed CSS
// 4. layout (flex)
// 5. render

const net = require('net')
const parser = require('./parse')
const render = require('./render')
const images = require('images')

class Request {
  constructor(options) {
    this.method = options.method || 'GET'
    this.host = options.host
    this.port = options.port || 80
    this.path = options.path || '/'
    this.headers = options.headers || {}
    this.body = options.body || {}

    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body)
    } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
    }

    this.headers['Content-Length'] = this.bodyText.length
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\n\r\n${this.bodyText}`
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const responseParser = new ResponseParser
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString())
        })
      }

      // console.log(this.headers)
      // console.log(this.toString())
      connection.on('data', (data) => {
        responseParser.receive(data.toString())

        console.log(data.toString())
        if (responseParser.isFinished) {
          resolve(responseParser.response)
        }

        connection.end()
      })

      connection.on('error', (err) => {
        reject(err)
        connection.end()
      })
    })
  }
}

class ResponseParser {
  constructor() {
    this.status_line = 0
    this.status_line_end = 1

    this.header_name = 2
    this.header_space = 3
    this.header_value = 4
    this.header_line_end = 5
    this.header_block_end = 6

    this.waiting_body = 7


    this.current = this.status_line
    this.statusLine = ''
    this.headers = {}
    this.headerName = ''
    this.headerValue = ''
    this.bodyParser = null
  }
  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished
  }
  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }
  receive(str) {
    for (let i = 0; i < str.length; i++) {
      this.receiveChar(str.charAt(i))
    }
  }
  receiveChar(char) {
    if (this.current === this.status_line) {
      if (char === '\r') {
        this.current = this.status_line_end
      } else {
        this.statusLine += char
      }
      return void 0
    }

    if (this.current === this.status_line_end) {
      if (char === '\n') {
        this.current = this.header_name
      }
      return void 0
    }

    if (this.current === this.header_name) {
      if (char === ':') {
        this.current = this.header_space
      } else if (char === '\r') {
        this.current = this.header_block_end
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new TrunkedBodyParser()
        }
      } else {
        this.headerName += char
      }
      return void 0
    }

    if (this.current === this.header_space) {
      if (char === ' ') {
        this.current = this.header_value
      }
      return void 0
    }

    if (this.current === this.header_value) {
      if (char === '\r') {
        this.current = this.header_line_end
        this.headers[this.headerName] = this.headerValue
        this.headerName = ''
        this.headerValue = ''
      } else {
        this.headerValue += char
      }
      return void 0
    }

    if (this.current === this.header_line_end) {
      if (char === '\n') {
        this.current = this.header_name
      }
      return void 0
    }

    if (this.current === this.header_block_end) {
      if (char === '\n') {
        this.current = this.waiting_body
      }
      return void 0
    }

    if (this.current === this.waiting_body) {
      this.bodyParser.receiveChar(char)
    }
  }
}

class TrunkedBodyParser {
   constructor() {
     this.waiting_length = 0
     this.waiting_length_line_end = 1
     this.reading_trunk = 2
     this.waiting_new_line = 3
     this.waiting_new_line_end = 4

     this.current = this.waiting_length
     this.length = 0
     this.content = []
     this.isFinished = false
   }
   receiveChar(char) {
     if (this.current === this.waiting_length) {
       if (char === '\r') {
         if (this.length === 0) {
           this.isFinished = true
         }
         this.current = this.waiting_length_line_end
       } else {
         this.length *= 16
         this.length += parseInt(char, 16)
       }
       return void 0
     }

     if (this.current === this.waiting_length_line_end) {
       if (char === '\n') {
         this.current = this.reading_trunk
       }
       return void 0
     }

     if (this.current === this.reading_trunk) {
       this.content.push(char)
       this.length--
       if (this.length === 0) {
         this.current = this.waiting_new_line
       }
       return void 0
     }

     if (this.current === this.waiting_new_line) {
       if (char === '\r') {
         this.current = this.waiting_length_line_end
       }
       return void 0
     }

     if (this.current === this.waiting_new_line_end) {
       if (char === '\n') {
         this.current = this.waiting_length
       }
       return void 0
     }
   }
}

void async function() {
  let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '6066',
    path: '/',
    headers: {
      ['x-Name']: 'OMO'
    },
    body: {
      name: 'zongqilin'
    }
  })

  let response = await request.send()

  let dom = parser.parseHTML(response.body)

  let viewport = images(800, 600)

  render(viewport, dom)

  viewport.save('viewport.jpg')
}()

// 直接发送

// const client = net.createConnection({
//   host: '127.0.0.1',
//   port: 6066
// }, () => {
//   // client.write('POST / HTTP/1.1\r\n');
//   // client.write('Content-Length: 14\r\n');
//   // client.write('Content-Type: application/x-www-form-urlencoded\r\n');
//   // client.write('\r\n');
//   // client.write('name=zongqilin');
//
//   // client.write(`POST / HTTP/1.1\r\nContent-Length: 14\r\nContent-Type: application/x-www-form-urlencoded\r\n\r\nname=zongqilin`)
//
//   client.write(`
//   POST / HTTP/1.1\r
//   Content-Length: 14\r
//   Content-Type: application/x-www-form-urlencoded\r
//   \r
//   name=zongqilin
//   `)
// })
// client.on('data', (data) => {
//   console.log(data.toString())
//   client.end()
// })
// client.on('end', () => {
//   console.log('disconnected from server')
// })
//
// client.on('error', (err) => {
//   console.log('err: ', err)
//   client.end()
// })
