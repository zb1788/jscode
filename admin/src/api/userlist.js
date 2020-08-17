import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/getUserList',
    method: 'get',
    params
  })
}


export function addUser(params) {
  return request({
    url: '/addUser',
    method: 'get',
    params
  })
}

export function getUserInfos(params) {
  return request({
    url: '/getUserInfos',
    method: 'get',
    params
  })
}

export function delUser(params) {
  return request({
    url: '/delUser',
    method: 'get',
    params
  })
}