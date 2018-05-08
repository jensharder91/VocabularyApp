var fs = require('fs');
var path = require('path');
var dirPath = "./"; //directory path
var fileType = '.csv'; //file extension


fs.readdir(dirPath, function(err, list) {
  if (err) throw err;
  for (var i = 0; i < list.length; i++) {
    if (path.extname(list[i]) === ".csv-utf8") {
      fs.rename(list[i], list[i].substr(0, list[i].lastIndexOf(".")) + ".csv", function(err) {
        if (err) console.log('ERROR: ' + err);
      });
    }
  }
});
