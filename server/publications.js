Meteor.publish('tests', function() {
  var self = this;
  
  _.each(Tests, function(val, key) {
    self.added('tests', Random.id(), {name: key});
  })
  
  self.ready();
});

Meteor.publish('results', function() {
  return Results.find({}, {fields: {
    when: 1,
    name: 1, testName: 1, done: 1,
    url: 1, iterations: 1, over: 1
  }});
});

Meteor.publish('result', function(id) {
  return Results.find(id);
});