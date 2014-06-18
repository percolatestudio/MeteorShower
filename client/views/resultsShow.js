Template.resultsShow.helpers({
  done: function() {
    return this.done && 'Done';
  },

  loads: function() {
    return _.map(this.readings, function(r) { return r.load.cpu; });
  },

  average: function(stat, divisor) {
    divisor = divisor instanceof Spacebars.kw ? 1 : divisor;
    var total = _.reduce(stat, function(n, i) { return n+i; }, 0);
    return ((total / stat.length) / divisor).toFixed(2);
  },

  max: function(stat, divisor) {
    divisor = divisor instanceof Spacebars.kw ? 1 : divisor;
    return (Math.max.apply(Math, stat) / divisor).toFixed(2);
  }
});