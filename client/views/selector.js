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
    
    var options = {};
    var iterations = parseInt(template.$('[name=iterations]').val(),10);
    if (iterations)
      options.iterations = iterations
    
    var over = parseInt(template.$('[name=over]').val(), 10);
    if (over)
      options.over = over * 1000;
    
    Meteor.call('runTest', test.url, test.name, options);
  }
});