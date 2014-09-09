Blaze.registerHelper('host', function() {
  return Meteor.settings.public.testHost;
});

Blaze.registerHelper('port', function() {
  return Meteor.settings.public.testPort;
});

Blaze.registerHelper('formatDate', function(date) {
  return moment(date).format('lll');
});
