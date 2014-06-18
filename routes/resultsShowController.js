ResultsShowController = RouteController.extend({
  waitOn: function() {
    return [
      Meteor.subscribe('result', this.params._id)
    ];
  },
  
  data: function() {
    return Results.findOne(this.params._id)
  }
});