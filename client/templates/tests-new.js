Template.testsNew.events({
  'submit': function(e, t) {
    e.preventDefault();
    
    var test = {
      name: t.$('[name=name]').val(),
      publication: t.$('[name=publication]').val(),
      method: t.$('[name=method]').val()
    }
    
    if (! test.publication)
      throw "You need a publication, dummy";
    
    test._id = Tests.insert(test);
    Router.go('testsShow', test);
  }
});