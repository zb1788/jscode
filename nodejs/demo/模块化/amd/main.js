require.config({
    paths:{
        "jquery": "lib/jquery.min",
        "rand":"modules/rand",
        "percent":"modules/percent"
    }
})


require(['percent','jquery'],function(percent, $){
    $('button').click(function(){
        let result = percent(80);
        if(result){
            $('#result1').fadeIn();
            $('#result2').fadeOut();
        }else{
            $('#result1').fadeOut();
            $('#result2').fadeIn();
        }
    })
})