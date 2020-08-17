/**
 * 文件系统
 */

 //1同步打开
//  var fs = require('fs');
//  var fd = fs.openSync('1.txt','w');
//  console.log(fd);
//  if(fd){
//      fs.writeSync(fd,'222');
//      fs.closeSync();
//  }

 //2异步打开
 var fs2 = require('fs');
fs2.open('2.txt','w',function(err,fd){     
     console.log(err);
     console.log(fd);
     if(err) { throw err };
     fs2.write(fd,'哈哈哈哈',function(err){
        fs2.close(fd,function(err){
            
        });
     });     
 })