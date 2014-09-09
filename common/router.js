Router.map(function() {
  this.route('home', {
    path: '/',
    waitOn: function() {
      return Meteor.subscribe('tests');
    }
  });
  
  this.route('testsNew', {
    path: '/tests/new',
  });
  
  this.route('testsShow', {
    path: '/tests/:_id',
    waitOn: function() {
      return Meteor.subscribe('test', this.params._id);
    },
    data: function() {
      return Tests.findOne(this.params._id);
    }
  });

  this.route('resultsNew', {
    path: '/tests/:testId/results/new',
    action: function() {
      var self = this;
      Meteor.call('Results.insert', {testId: this.params.testId}, function(err, r) {
        if (r.ok) {
          Router.go('resultsShow', {
            _id: r._id,
            testId: self.params.testId
          }, {replaceState: true});
        }
      });
    }
  });

  this.route('resultsShow', {
    path: '/tests/:testId/results/:_id',
    waitOn: function() {
      return [
        Meteor.subscribe('test', this.params.testId),
        Meteor.subscribe('result', this.params._id)
      ]
    },
    data: function() {
      return Results.findOne(this.params._id);
    }
  });
});