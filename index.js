'use strict';
var merge 		 = require('lodash/object/merge');
var core 		   = require('./core');
var chain 		 = require('./chain');

exports = merge(exports, core);
exports = merge(exports, chain);
