Template.results.helpers({
  overSeconds: function() {
    return this.over / 1000;
  },
  
  done: function() {
    return this.done && 'Done';
  },
  
  results: function() {
    return Results.find({}, {sort: {when: -1}});
  },
  
  averageTime: function() {
    var total = _.reduce(this.times, function(n, i) { return n+i; }, 0);
    return ((total / this.times.length) / 1000).toFixed(2);
  },
  
  maxTime: function() {
    return (Math.max.apply(Math, this.times) / 1000).toFixed(2);
  }
})