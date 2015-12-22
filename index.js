'use strict';
var merge 		 = require('lodash/object/merge');
var core 		   = require('./lib/core');
var chain 		 = require('./lib/chain');
var scheme     = require('./lib/scheme');

exports = merge(exports, core, chain, scheme);
