ResultsShowController = RouteController.extend({
  waitOn: function() {
    console.log('here', this.params._id);
    return [
      Meteor.subscribe('result', this.params._id)
    ];
  },
  
  data: function() {
    return Results.findOne(this.params._id)
  }
});