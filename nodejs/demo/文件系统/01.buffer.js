/**
 * Buffer(缓冲区)
 */

 var str = 'hello word';

 //将一个字符串存入buffer中
 var buf = Buffer.from(str);
 //console.log(buf);

//创建一个10字节的buffer
var buf2 = Buffer.alloc(10);
console.log(buf2);


var buf3 = Buffer.allocUnsafe(10);
console.log(buf3);