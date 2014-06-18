HomeController = RouteController.extend({
  waitOn: function() {
    return [
      Meteor.subscribe('tests'),
      Meteor.subscribe('environments'),
      Meteor.subscribe('results')
    ];
  }
});