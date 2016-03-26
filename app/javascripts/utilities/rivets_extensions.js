
var rivets = require('rivets');

// === Binders ===
rivets.binders.color = function(el, value) {
  el.style['background-color'] = value
}

// === Formatters ===
rivets.formatters.length = function(value) {
  return value && value.length;
}

rivets.formatters.gt = function(value, arg) {
  return value > arg;
}

rivets.formatters.gte = function(value, arg) {
  return value >= arg;
}

rivets.formatters.lt = function(value, arg) {
  return value < arg;
}

rivets.formatters.lte = function(value, arg) {
  return value >= arg;
}

rivets.formatters.eq = function(value, arg) {
  return value == arg;
}

rivets.formatters.and = function(value, arg) {
  return value && arg;
}

rivets.formatters.or = function(value, arg) {
  return value || arg;
}

// Concatenate
rivets.formatters['+'] = function(value, arg) {
  return value + arg;
}

// Allows rv-each-* to work on objects..
// Borrowed from: https://github.com/mikeric/rivets/issues/105
rivets.formatters.to_a = function(value) {
  var new_value = [];
  _.forEach(value, function(v, k) {
    new_value.push({key: k, value: v})
  });
  return new_value;
}
