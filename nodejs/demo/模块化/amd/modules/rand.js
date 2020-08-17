define(function(){
    //关于抽奖 中奖的概率实现
    function rand(m,n){
        return Math.ceil((Math.random()*(n-m+1))+m-1);
    }
    return rand;
})