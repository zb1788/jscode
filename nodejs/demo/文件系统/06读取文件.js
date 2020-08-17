var fs = require('fs');
var readline = require('readline');
//同步读取整个文件内容
let data = fs.readFileSync('./hello.txt');
console.log(data.toString());

//按行读取文件内容
readFileToArr('./hello.txt',function(data){
    console.log(data);
    for(let item of data){
        console.log(item);
    }
});


function readFileToArr(flieName,callback){
    var fRead = fs.createReadStream(flieName);
    var objReadLine = readline.createInterface({
        input:fRead
    });
    var arr = new Array();
    objReadLine.on('line',function(line){
        arr.push(line);
    })
    objReadLine.on('close',function(){
        callback(arr);
    })
}