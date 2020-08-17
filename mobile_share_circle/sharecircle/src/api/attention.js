import request from '@/utils/request'
import axios from 'axios'
// import utils from '@/utils/common';

//获取关注列表
export function getAttentionList(url,params,method) {
  return request({
    url: url,
    method: method,
    data:params
  })
}

//处理关注列表json数据
export function getAttentionArr(data){     
    let arr = []
    if(data && data.items.length>0){
        for(let item of data.items){
            arr.push(item.concernAccount)
        }
    }
    return arr;
}


//关注
export function onAttention(url,params,method,token) {
    return axios({
        method:"get",
        url:url,
        params:params,
        headers:{
            "token":token
        }
    })
}

//取消关注
export function offAttention(url,params,method,token) {
    return axios({
        method:"get",
        url:url,
        params:params,
        headers:{
            "token":token
        }
    })    
}  