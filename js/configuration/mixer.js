var config = require('./config.js').config;
var fs = require('fs');
var i = 0;
var content = {};
var output = '';
function each(arr, callback){
  var i = 0;
  var output = '';
  for(i ; i < arr.length; i++){
    output += callback(i, arr[i]);
  }
}

function mend() {
  var stream = fs.createWriteStream(config.base + 'project.js');
  stream.once('open', function (fd) {
  each(config.scripts, function (i, val){
    stream.write(content[val]);
  });

  });


  console.log('Created: project.js');
  console.log('Add it to your krl file');

  
}

each(config.scripts, function (i, val) {
  var file = config.base + val;
  fs.readFile(file, function (err, data) {
    if(err) {
      console.error('could not open file: ', err);
      process.exit(1);
    }
    content[val] = data;
    if(i === config.scripts.length -1){
      mend();
    }
  });
});






