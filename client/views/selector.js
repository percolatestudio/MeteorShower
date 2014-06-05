Template.selector.helpers({
  tests: function() {
    return Tests.find();
  }
});

Template.selector.events({
  'click .go': function(e, template) {
    e.preventDefault();
    
    var test = {
      name: template.$('[name=test]').val(),
      url: template.$('[name=url]').val()
    }
    
    Meteor.call('runTest', test.url, test.name);
  }
});