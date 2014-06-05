Meteor.publish('tests', function() {
  var self = this;
  
  _.each(Tests, function(val, key) {
    self.added('tests', Random.id(), {name: key});
  })
  
  self.ready();
});

Meteor.publish('results', function() {
  return Results.find();
});