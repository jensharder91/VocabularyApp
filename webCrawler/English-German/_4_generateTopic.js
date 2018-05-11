var fs = require('fs');
var path = require('path');
var dirPath = "./"; //directory path
var fileType = '.csv'; //file extension

var list;

fs.readdir(dirPath, function(err, list) {
  if (err) throw err;

  this.list= list;

  writeRow(0);
  // for (var i = 0; i < list.length; i++) {
  //   if (path.extname(list[i]) === fileType) {
  //     console.log(list[i]); //print the file
  //     let statement = 'topics.push(<Topic>{ id: "_' + list[i].substr(0, list[i].lastIndexOf(".")).replace(/\s/g, "").toLowerCase() + '", name: "' + list[i].substr(0, list[i].lastIndexOf(".")).replace("_", " ").replace("_", " ") + '", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/' + list[i] + '" });\n';
  //     fs.appendFile('_generatedTopics.txt', statement, function(error) {
  //       if (error) throw error;
  //     });
  //   }
  // }
});

function writeRow(index){
  if(index >= this.list.length)return;

  if (path.extname(this.list[index]) === fileType) {
    console.log(this.list[index]); //print the file
    let statement = 'topics.push(<Topic>{ id: "_' + this.list[index].substr(0, this.list[index].lastIndexOf(".")).replace(/\s/g, "").toLowerCase() + '", name: "' + this.list[index].substr(0, this.list[index].lastIndexOf(".")).replace("_", " ").replace("_", " ") + '", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/' + this.list[index] + '" });\n';
    fs.appendFile('_generatedTopics.txt', statement, function(error) {
      if (error) throw error;

      writeRow(++index)
    });
  }
}
