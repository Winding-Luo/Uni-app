// miniprogram/pages/index/index.ts
import { loginApi, getActivityListApi } from '../../api/index'

Page({
  data: {
    // 用于在 WXML 中展示的活动列表
    activities: [] as any[], 
  },

  /**
   * 1. 登录按钮点击事件
   */
  async onLogin() {
    try {
      // RuoYi 默认的管理员账号
      const loginData = {
        username: 'admin',
        password: 'admin123'
      }

      wx.showLoading({ title: '登录中...' })
      
      // 调用我们封装的登录 API
      const res = await loginApi(loginData) as { token: string }
      
      // 登录成功，RuoYi会返回 token
      if (res.token) {
        // 关键：将 Token 保存到本地存储
        wx.setStorageSync('token', res.token)
        wx.hideLoading()
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
      } else {
        wx.hideLoading()
        wx.showToast({ title: '登录失败，没有Token', icon: 'none' })
      }
      
    } catch (error) {
      wx.hideLoading()
      console.error('登录失败', error)
      // 在 request.ts 中已经有错误提示了
    }
  },

  /**
   * 2. 获取活动列表按钮点击事件
   */
  async getActivities() {
    try {
      wx.showLoading({ title: '加载中...' })

      // 调用获取活动列表的 API
      // request.ts 会自动携带 Token
      const res = await getActivityListApi() as { rows: any[], total: number }
      
      wx.hideLoading()

      // RuoYi 的列表数据在 res.rows 中
      if (res.rows) {
        console.log('从后端获取到的数据:', res.rows)
        // 使用 setData 更新 WXML 中的数据
        this.setData({
          activities: res.rows
        })
      }
    } catch (error) {
      wx.hideLoading()
      console.error('获取活动失败', error)
      // 如果 token 失效，RuoYi 会返回 401，request.ts 中会提示
    }
  }
})