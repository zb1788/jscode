import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/tablelist',
    method: 'get',
    params
  })
}
