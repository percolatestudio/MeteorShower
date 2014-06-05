Tests['simple-http'] = {
  noConnection: true,
  action: function(url) {
    var start = new Date;
    console.log('Hitting', url);
    HTTP.get(url);
    console.log('Got', url, 'in', (new Date - start) / 1000, 'seconds');
  }
}