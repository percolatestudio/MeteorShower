// var TIME_RANGES = ['day', 'week', 'month', 'year'];
// 
// // XXX: make this actually work
// Tests['atmosphere-homepage'] = function() {
//   console.log('here', this)
//   var self = this;
//   var Packages = new Meteor.Collection('packages', {connection: self});
//   
//   self.subscribe('trendingPackages');
//   self.subscribe('recentPackages');
// 
//   _.each(TIME_RANGES, function(period) {
//     self.subscribe('mostUsedPackages', period);
//     self.subscribe('topSearches', period);
//   });
// 
//   self.subscribe('topSearches');
//   
//   Packages.find().forEach(function(pkg) {
//     self.subscribe('dailyScores', pkg.metadata.name);
//   });
// }