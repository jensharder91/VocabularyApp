var fs = require('fs');
var path = require('path');
var dirPath = "./"; //directory path
var fileType = '.csv'; //file extension

fs.readdir(dirPath, function(err, list) {
  if (err) throw err;
  for (var i = 0; i < list.length; i++) {
    if (path.extname(list[i]) === fileType) {
      console.log(list[i]); //print the file
      let statement = 'topics.push(<Topic>{ id: "_' + list[i].substr(0, list[i].lastIndexOf(".")).replace(/\s/g, "").toLowerCase() + '", name: "' + list[i].substr(0, list[i].lastIndexOf(".")) + '", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/' + list[i] + '" });\n';
      fs.appendFile('_generatedTopics.txt', statement, function(error) {
        if (error) throw error;
      });
    }
  }
});
