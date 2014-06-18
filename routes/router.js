Router.configure({
  loadingTemplate: function() {
    return 'loading'
  }
});

Router.map(function() {
  this.route('home', {path: '/'})
  
  this.route('resultsShow', {path: '/results/:_id'});
});

if (Meteor.isClient) {
  Router.onBeforeAction('loading');
}