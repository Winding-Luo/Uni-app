// miniprogram/pages/login/index/index.ts
import { loginApi } from '../../../api/index'

Page({
  data: {
    username: '', // 默认为空
    password: '', // 默认为空
    loading: false
  },

  // 绑定用户名输入
  onUsernameInput(e: WechatMiniprogram.Input) {
    this.setData({
      username: e.detail.value
    })
  },

  // 绑定密码输入
  onPasswordInput(e: WechatMiniprogram.Input) {
    this.setData({
      password: e.detail.value
    })
  },

  /**
   * 登录按钮点击事件
   */
  async onLogin() {
    if (this.data.loading) return
    
    // 简单校验
    if (!this.data.username) {
      wx.showToast({ title: '请输入用户名', icon: 'none' })
      return
    }
    if (!this.data.password) {
      wx.showToast({ title: '请输入密码', icon: 'none' })
      return
    }

    this.setData({ loading: true })

    try {
      const loginData = {
        username: this.data.username,
        password: this.data.password
        // code 和 uuid 我们不传，因为后端验证码已关
      }
      
      // 调用我们封装的登录 API
      const res = await loginApi(loginData) as { token: string }
      
      // 登录成功，RuoYi会返回 token
      if (res.token) {
        // 关键：将 Token 保存到本地存储
        wx.setStorageSync('token', res.token)
        this.setData({ loading: false })
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
        
        // 登录成功，跳转到"校园圈子"页面
        wx.switchTab({
          url: '/pages/topic/index/index'
        })
        
      } else {
        throw new Error('后端未返回Token')
      }
      
    } catch (error: any) {
      this.setData({ loading: false })
      console.error('登录失败', error)
      // 如果后端返回 "验证码已失效" 之外的错误，
      // request.ts 会自动弹窗提示，例如 "用户不存在/密码错误"
    }
  },

  /**
   * (测试用) 跳转到校园圈子
   */
  goToHome() {
    wx.switchTab({
      url: '/pages/topic/index/index'
    })
  }
})