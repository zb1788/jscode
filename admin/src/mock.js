const Mock=require('mockjs');

var template={
    'data|1-4':[{
    'title':'@title',
    'article':'@article'
    }]
}

var template1 = {
    "number|1-100": 100
}


Mock.mock(/apidata/,template);   