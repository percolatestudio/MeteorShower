Template.results.helpers({
  results: function() {
    return Results.find({}, {sort: {when: -1}});
  }
});