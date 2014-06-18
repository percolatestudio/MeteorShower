var TIME_RANGES = ['day', 'week', 'month', 'year'];

var Future = Npm.require('fibers/future');

// this should be done by default I guess
var makeConnectionSync = function(sub) {
  var oldSubscribe = sub.subscribe;
  
  sub.subscribe = function() {
    var future = new Future;

    var newArgs = Array.prototype.slice.call(arguments)
    newArgs.push({
      onReady: _.bind(future.return, future),
      onError: function(error) {
        future.throw(new Error('Subscription Error:' + error.reason))
      }
    });
    oldSubscribe.apply(sub, newArgs);

    return future.wait();
  }
}

Environments['atmosphere-homepage'] = function() {
  var self = this;
  
  makeConnectionSync(self);
  var Packages = new Meteor.Collection('packages', {connection: self});

  self.subscribe('trendingPackages');
  self.subscribe('recentPackages');

  _.each(TIME_RANGES, function(period) {
    self.subscribe('mostUsedPackages', period);
    self.subscribe('topSearches', period);
  });

  Packages.find().forEach(function(pkg) {
    self.subscribe('dailyScores', pkg.metadata.name);
  });
}

