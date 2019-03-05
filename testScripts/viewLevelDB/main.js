//https://medium.com/coinmonks/data-structure-in-ethereum-episode-4-diving-by-examples-f6a4cbd8c329
var path = require('path');
var levelup = require('levelup');
var leveldown = require('leveldown');

/**
 * Level DB
 */
var levelDBPath = path.relative('./', './geth/chaindata');
var db = levelup(leveldown(levelDBPath));


/**
 * Global variable
 */
global.db = db;

var db = global.db;

var ethBlock = require('ethereumjs-block');

var utils = require('./libs/utils');
var geth = require('./libs/geth');


/**
 * For debugging
 */
console.log("For debugging:");
geth.getStateRoot(3539);
console.log("\n");

/**
 * Constants
 */
const prefix = utils.stringToHex('h');
const suffix = utils.stringToHex('n');

/**
 * Test leveldb
 */
var blockNumber = 509;
var hexBlockNumber = utils.padLeft(utils.decimalToHex(blockNumber), 16);
var keyString = prefix + hexBlockNumber + suffix;
var key = new Buffer(keyString, 'hex');

console.log('Block Number:', key);

db.get(key, function (er, value) {
    if (er) throw new Error(er);

    console.log('Block Hash:', value);

    value = value.toString('hex');
    var keyString = prefix + hexBlockNumber + value;
    var key = new Buffer(keyString, 'hex');

    db.get(key, function (er, value) {
        if (er) throw new Error(er);

        console.log('Raw Block Data:', value);

        var block = new ethBlock.Header(value);
        var stateRoot = block.stateRoot;
        console.log('State Root:', stateRoot);
    });
});
