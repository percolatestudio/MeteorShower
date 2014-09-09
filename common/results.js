// Format:
//
// {
//   _id: ...,
//   testId: ...,
//   createdAt: Date,
//   completed: true/false,
//   timings: [Number]
// }

Results = new Mongo.Collection('results');

Results.init = function(doc) {
  return Results._transform(_.extend({
    createdAt: new Date,
    completed: false,
    timings: []
  }, doc));
}

Results.helpers({
  test: function() {
    return Tests.findOne(this.testId);
  }
});

Meteor.methods({
  'Results.insert': function(doc) {
    check(doc, {
      testId: String
    });
    
    var result = Results.init(doc);
    result._id = Results.insert(result);
    
    // start the test in a timeout so it doesn't block the method
    if (! this.isSimulation) {
      Meteor.setTimeout(function() {
        startTestRun(result);
      });
    }
    
    return {
      ok: true,
      _id: result._id
    };
  }
});

if (Meteor.isServer) {
  Meteor.publish('result', function(id) {
    check(id, String);
    return Results.find(id);
  });
}