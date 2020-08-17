const utils = {
    trim : function(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    trimStr : function(str,replace){
        return str.replace(eval("/(^" + replace + "*)|(" + replace + "*$)/g"), "");
    },
    nameFormat : function(trueName,num){
        if(trueName.length>6){
          return trueName.substr(0,5)+"…"
        }else{
          return trueName
        }
    },
    findEleInArr(ele, arr) {
        if (!Array.indexOf) {
          Array.prototype.indexOf = function(obj) {
            for (var i = 0; i < this.length; i++) {
              if (this[i] == obj) {
                return i;
              }
            }
            return -1;
          };
        }
        var index = arr.indexOf(ele);
        return index;
    }
}

export default utils;