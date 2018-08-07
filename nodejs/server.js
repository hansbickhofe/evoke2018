'use strict'; // ;-)
var os = require('os');
var hostname = os.hostname();
var configname = './config/'+hostname+'-config' ;
const config = require(configname);

var redis = require('redis');

// Redis DB functions
var redisgame = require('./lib/redisfunctions');

var client = redis.createClient(); //creates a new client
client.select(config.REDISDB, function() { /* ... */ });

var sub = redis.createClient();
var pub = redis.createClient();

sub.subscribe('pose');

//  helmet hardening
var helmet = require('helmet');

// express
var express = require('express');
var app = express();

// use helmet and disable "x-powered-by"
app.use(helmet.contentSecurityPolicy({
  // Specify directives as normal.
  directives: {
    defaultSrc: ["'self'", config.HOST],
    scriptSrc: ["'self'", 'https://cdn.socket.io'],
    styleSrc: [config.HOST ,"'self'"],
    imgSrc: [config.HOST, "'self'", 'data:'],
    sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
    // reportUri: '/report-violation',
    objectSrc: [config.HOST, "'self'", 'data:'] // An empty array allows nothing through
  },
  reportOnly: false,
  setAllHeaders: false,
  disableAndroid: true,
  browserSniff: false
}));

app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());
app.use(helmet.noCache());
app.use(helmet.dnsPrefetchControl({ allow: false }));
app.set('trust proxy', 1)


var http = require('http').createServer(app,function (req, res)
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
});

var io = require('socket.io')(http);

io.on('connection', function(socket)
{
  socket.on('disconnect', function() {
    console.log("Diconnect");
  });

});


