// import our modules
var http         = require('http')
var Router       = require('router')
var finalhandler = require('finalhandler')
var compression  = require('compression')
//var bodyParser   = require('body-parser')
var selfPresignedUrl   = require('./self_sign.js')
var sdkPresignedUrl = require('./sdk_sign.js')


const hostname = '127.0.0.1';
const port = 3000;
 
// store our message to display
var messageSelf = selfPresignedUrl
var messageSdk = sdkPresignedUrl
 
// initialize the router & server and add a final callback.
var router = Router()
var server = http.createServer(function onRequest(req, res) {
  router(req, res, finalhandler(req, res))
  //res.statusCode = 200;
  //res.setHeader('Content-Type', 'text/plain');
  //res.end('aws sdk signed url: http://' + hostname + ':' + port +'/message-sdk/\n');
  //res.end('sel signed url    : http://' + hostname + ':' + port +'/message-self/\n');
})
 
// use some middleware and compress all outgoing responses
router.use(compression())

//index
router.get('/', function (req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end('sdk signed url: http://' + hostname + ':' + port +'/message-sdk/\n'+
          'self signed url: http://' + hostname + ':' + port +'/message-self/\n')
}) 
// handle `GET` requests to `/message-self`
router.get('/message-self', function (req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end(messageSelf + '\n')
})

// handle `GET` requests to `/message-sdk`
router.get('/message-sdk', function (req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end(messageSdk + '\n')
})
 

// make http server listen to connections
server.listen(3000)
console.log(`Server running at http://${hostname}:${port}/`);
