'use strict';
var merge 		 = require('lodash/merge');
var core 		   = require('./lib/core');
var chain 		 = require('./lib/chain');
var scheme     = require('./lib/scheme');
var parse      = require('./lib/parse');

exports = merge(exports, core, chain, scheme, parse);
