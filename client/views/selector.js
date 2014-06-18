Template.selector.helpers({
  tests: function() {
    return Tests.find();
  }
});

Template.selector.events({
  'click .go': function(e, template) {
    e.preventDefault();
    
    var options = {
      name: template.$('[name=name]').val(),
      test: template.$('[name=test]').val(),
      url: template.$('[name=url]').val()
    }
    
    var iterations = parseInt(template.$('[name=iterations]').val(),10);
    if (iterations)
      options.iterations = iterations
    
    var over = parseInt(template.$('[name=over]').val(), 10);
    if (over)
      options.over = over * 1000;
    
    var result = {_id: Random.id()};
    Meteor.call('runTest', result._id, options);
    Router.go('resultsShow', result);
  },
  'click .reset': function(e, template) {
    e.preventDefault();

    Meteor.call('reset');
  }
});