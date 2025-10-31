// miniprogram/api/index.ts

import { request } from '../utils/request'

/**
 * 1. 登录接口 (用于测试)
 */
export const loginApi = (data: object) => {
  return request({
    url: '/login', // RuoYi的登录接口
    method: 'POST',
    data: data
  })
}

/**
 * 2. 获取校园圈子帖子列表
 * (这是 "校园圈子" 页面 需要的)
 * 对应 CampusTopicController.java 的 list
 */
export const getTopicListApi = (params?: object) => {
  return request({
    url: '/campus/topic/list',
    method: 'GET',
    data: params // 分页参数 { pageNum: 1, pageSize: 10 }
  })
}

// (我们先把其他模块的API删掉，等开发到那个模块时再加回来)