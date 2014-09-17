// Provide defaults for Meteor.settings.public
if (typeof Meteor.settings === 'undefined')
  Meteor.settings = {public: {}};

if (typeof Meteor.settings.public === 'undefined')
  Meteor.settings.public = {};

_.defaults(Meteor.settings.public, {
  environment: 'development',
  testHost: 'george.percolatestudio.com',
  testPort: '8080'
});