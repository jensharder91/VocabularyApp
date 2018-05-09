var fs = require('fs');
var path = require('path');
var dirPath = "./"; //directory path
var fileType = '.csv'; //file extension


fs.readdir(dirPath, function(err, list) {
  if (err) throw err;
  for (var i = 0; i < list.length; i++) {
    if (path.extname(list[i]) === ".csv") {
      fs.unlink(list[i], (err) => {
        if (err) throw err;
        console.log('path/file.txt was deleted');
      });
    }
  }

});
