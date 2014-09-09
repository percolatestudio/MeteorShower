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
  return _.extend({
    createdAt: new Date,
    completed: false,
    timings: []
  }, doc);
}

Results.helpers({
  test: function() {
    return Tests.findOne(this.testId);
  }
});

if (Meteor.isServer) {
  Meteor.publish('result', function(id) {
    check(id, String);
    return Results.find(id);
  });
}