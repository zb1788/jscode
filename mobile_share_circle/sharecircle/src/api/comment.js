import request from '@/utils/request'

//批量获取评论列表
export function getCommentList(url,params,method) {
  return request({
      url: url,
      method: method,
      data:params
  })
} 

//提交评论
export function addComment(url,params,method) {
    return request({
      url: url,
      method: method,
      data:params
    })
}

//删除评论
export function delCommentById(url,params,method) {
  return request({
    url: url,
    method: method,
    data:params
  })
}

//获取投票选项
export function getVoteList(url,params,method) {
  return request({
    url: url,
    method: method,
    data:params
  })
}

//获取投票结果
export function getVoteListResult(url,params,method) {
  return request({
      url: url,
      method: method,
      data:params
  })
}  

//提交投票
export function addVote(url,params,method) {
    return request({
      url: url,
      method: method,
      data:params
    })
}
