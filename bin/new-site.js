#!/usr/bin/env node

var args = process.argv.splice(process.execArgv.length + 2);
var domain_name = args[0];
var path = args[1];

var rootvanNew = require('../lib/index.js');

// Create domain for params
rootvanNew.create(domain_name,path);

