import aes from 'aes';
//加密
let a = aes.encrypt('Hello World', 'cee60757342c441997b2e5ed54c4028d');
console.log(a);
//解密
let b = aes.decrypt(a, 'cee60757342c441997b2e5ed54c4028d');
console.log(b);  