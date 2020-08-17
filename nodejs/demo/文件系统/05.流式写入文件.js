var fs = require('fs');

var ws = fs.createWriteStream('6.txt');

ws.once('open',() => {
    console.log('open');
})

ws.once('close',() => {
    console.log('close');
})

for(var i=0; i< 5; i++){
    ws.write(i+'');
}

ws.end(); 