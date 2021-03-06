'use strict';

var isArray = require('lodash.isarray');
var isObject = require('lodash.isobject');
var reduce = require('lodash.reduce');
var some = require('lodash.some');
var includes = require('lodash.includes');
var partial = require('lodash.partial');

function filterWithLens(schema, lenses, data){
  if (!isArray(lenses)) {
    throw new Error('lenses option must be an array');
  }
  if (!isObject(data)) {
    return;
  }

  return reduce(data, function(o, v, k){
    var allowed = schema[k];
    var validRules = isArray(allowed);
    var needsNesting = !validRules && isObject(allowed);

    if (validRules && some(lenses, partial(includes, allowed))) {
      o[k] = v;
    }
    if (needsNesting && isObject(v)) {
      o[k] = filterWithLens(allowed, lenses, v);
    }
    return o;
  }, {});
}

module.exports = filterWithLens;
