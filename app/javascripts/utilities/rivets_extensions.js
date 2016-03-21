
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
