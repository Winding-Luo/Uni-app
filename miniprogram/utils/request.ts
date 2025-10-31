// miniprogram/utils/request.ts

// 您的本地后端地址
const baseUrl = 'http://192.168.228.1:8080'

export const request = (options: WechatMiniprogram.RequestOption) => {
  return new Promise((resolve, reject) => {
    // 从本地存储中获取Token
    const token = wx.getStorageSync('token')
    
    // 准备请求头
    const header = options.header || {}
    if (token) {
      // 附带RuoYi需要的Authorization Header
      header['Authorization'] = 'Bearer ' + token
    }

    wx.request({
      ...options,
      url: baseUrl + options.url, // 自动拼接
      header: header,
      success(res) {
        if (res.statusCode === 200) {
          // RuoYi的响应体
          const data = res.data as { code: number, msg: string, token?: string, rows?: any[], total?: number }
          
          if (data.code === 200) {
            // 请求成功
            resolve(data)
          } else {
            // RuoYi返回的业务错误
            wx.showToast({ title: data.msg, icon: 'none' })
            reject(data)
          }
        } else {
          // HTTP 状态码错误
          wx.showToast({ title: '网络请求失败', icon: 'none' })
          reject(res)
        }
      },
      fail(err) {
        wx.showToast({ title: err.errMsg, icon: 'none' })
        reject(err)
      }
    })
  })
}