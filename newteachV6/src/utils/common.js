import Vue from 'vue'
import store from '@/store'
const commonUtils = {
    replaceAll(str,from,to){
        return str.replace(eval("/"+from+"/g"),to)
    },
    isNotEmpty(str){
        if(typeof str != 'undefined' && str != '' && str != null){
            return true
        }else{
            return false
        }
    },
    compareTime(startDate,endDate){
        //比较时间
        if(!this.isNotEmpty(startDate) && !this.isNotEmpty(endDate)){
            return null
        }else{
            if(!this.isNotEmpty(startDate)){
                startDate = new Date()
            }else{
                startDate = new Date(Date.parse(startDate))
            }
            if(!this.isNotEmpty(endDate)){
                endDate = new Date()
            }else{
                endDate = new Date(Date.parse(endDate))
            }
            return endDate - startDate            
        }
    },
    sortBy(attr,rev){
        //第二个参数没有传递 默认升序排列
        if(rev ==  undefined){
            rev = 1;
        }else{
            rev = (rev) ? 1 : -1;
        }

        return function(a,b){
            a = a[attr];
            b = b[attr];
            if(a < b){
                return rev * -1;
            }
            if(a > b){
                return rev * 1;
            }
            return 0;
        }
    },
    trim(text){
        return text.replace(/(^\s*)|(\s*$)/g, "");
    },
    trimItem(text,item){
        return text.replace(eval("/(^"+item+")|("+item+"$)/g"),""); 
    },
    findEleInArr(ele,arr){
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
    },
    objDeepCopy(source){
        let sourceCopy = source instanceof Array ? [] : {};
        for (let item in source) {
            sourceCopy[item] = typeof source[item] === 'object' ? this.objDeepCopy(source[item]) : source[item];
        }
        return sourceCopy;
    },
    //生成指定范围随机数
    RandomNumBoth(Min,Max){
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range); //四舍五入
        return num;
    },
    console(){
        if(store.getters.debug){
            let arr = ['#0eb83a','#3eede7','#ff2d51','#fff143','#8d4bbb','#161823','#ff0097','#758a99','#1bd1a5','#00e500','#ff7500','#b0a4e3']
            let color = arr[this.RandomNumBoth(0,11)]
            console.log('%c****************************************','color:'+color+';')
            for(var i=0; i<arguments.length; i++){
                console.log(arguments[i])
            }        
            console.log('%c****************************************','color:'+color+';')
        }
    },
    //获取popover的最小zIndex
    getMInPopoverZindex(){
        let domArr = document.getElementsByClassName('el-popover')
        let zIndex = 0
        for(let i=0;i<domArr.length;i++){
            let tmp = window.getComputedStyle(document.getElementsByClassName('el-popover')[i],null).zIndex
            if(zIndex == 0){
                zIndex = tmp
            }else{
                if(zIndex > tmp){
                    zIndex = tmp
                }
            }
        }
        return zIndex-1
    },
    getMaxZindex(){
        var arr = [...document.all].map(e => +window.getComputedStyle(e).zIndex || 0)
        return arr.length ? Math.max(...arr) : 0
    }
}

export default commonUtils