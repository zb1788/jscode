//获取区域列表
var warName = 'astat';
var furl = window.location.href.substring(0,window.location.href.indexOf('astatweb/'));


String.prototype.endWith = function(endStr){
    var d = this.length - endStr.length;
    return (d >= 0&&this.lastIndexOf(endStr) == d)
}

//var warName = '';
//var furl = 'http://stattest.yjt361.com/astat';
