// Format:
//
// {
//   _id: ...,
//   name: [optional],
//   publication: 'name',
//   method: [optional]
// }

Tests = new Mongo.Collection('tests');

Tests.helpers({
  results: function() {
    return Results.find({testId: this._id});
  }
});

if (Meteor.isServer) {
  Meteor.publish('tests', function() {
    return Tests.find();
  });
  
  Meteor.publish('test', function(id) {
    check(id, String);
    
    return [
      Tests.find(id),
      Results.find({testId: id}, {fields: {timings: false}})
    ]
  })
}