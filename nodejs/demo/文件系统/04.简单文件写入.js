/**
 * writeFile 不用打开 关闭文件
 */
var fs = require('fs');
fs.writeFile('3.txt','哈哈啊',(err) => {
    if(!err){
        console.log('ok');
    }
})


//flag:a 追加
fs.writeFile('4.txt','哈哈啊',{"flag":"a"},(err) => {
    if(!err){
        console.log('ok');
    }
})