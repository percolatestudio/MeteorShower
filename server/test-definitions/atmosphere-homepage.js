var TIME_RANGES = ['day', 'week', 'month', 'year'];

Environments['atmosphere-homepage'] = function() {
  var self = this;
  
  var Packages = new Meteor.Collection('packages', {connection: self});

  self.subscribe('counts');
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

