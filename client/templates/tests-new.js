Template.testsNew.events({
  'submit': function(e, t) {
    e.preventDefault();
    
    var test = {
      name: t.$('[name=name]').val(),
      publication: t.$('[name=publication]').val(),
      method: t.$('[name=method]').val()
    }
    
    if (! test.name)
      throw "You need a name, dummy";
    if (! test.publication)
      throw "You need a publication, dummy";
      
    Meteor.call('Tests.insert', test, function(error, r) {
      if (error) throw error;
      if (r.ok) Router.go('testsShow', {_id: r._id});
    });
  }
});