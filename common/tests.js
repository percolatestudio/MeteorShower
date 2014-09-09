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

Tests.init = function(doc) {
  return Tests._transform(_.extend({
  }, doc));
}


Meteor.methods({
  'Tests.insert': function(doc) {
    check(doc, {
      name: String,
      publication: String,
      method: Match.Optional(String)
    });
    
    var test = Tests.init(doc);
    
    var r = {
      ok: true,
      _id: Tests.insert(test)
    };
    
    return r;
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