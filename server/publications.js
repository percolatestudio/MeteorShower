var publishArray = function(sub, name, array) {
  _.each(array, function(val, key) {
    sub.added(name, Random.id(), {name: key});
  })
  
  sub.ready();
}

Meteor.publish('tests', function() {
  publishArray(this, 'tests', Tests);
});

Meteor.publish('environments', function() {
  publishArray(this, 'environments', Environments);
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