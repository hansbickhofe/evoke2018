'use strict'; // ;-)
//export main functions
module.exports.now = now ;
var os = require('os');
var hostname = os.hostname();
var configname = '../config/'+hostname+'-config' ;
//  get config
const config = require(configname);
// Redisconfig
var redisDb = parseInt(config.REDISDB);
var redis = require('redis');
var client = require('redis').createClient();
client.select(redisDb, function() {});
// timestamp
function now()
{
  return (Math.floor(Date.now() / 1000));
}

