Template.results.helpers({
  done: function() {
    return this.done && 'Done';
  },
  
  results: function() {
    return Results.find({}, {sort: {when: -1}});
  }
})