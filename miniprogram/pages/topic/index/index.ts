// miniprogram/pages/topic/index/index.ts
import { getTopicListApi } from '../../../api/index'

Page({
  data: {
    topicList: [] as any[], // 帖子列表
    loading: false,       // 是否正在加载
    pageNum: 1,           // 当前页码
    pageSize: 10,         // 每页数量
    total: 0,             // 总条数
    hasMoreData: true     // 是否还有更多数据
  },

  /**
   * 页面加载时
   */
  onLoad() {
    this.loadTopics(true) // 首次加载
  },

  /**
   * 加载帖子列表
   * @param reset 是否重置列表
   */
  async loadTopics(reset = false) {
    if (this.data.loading) return
    this.setData({ loading: true })

    if (reset) {
      this.setData({ pageNum: 1, hasMoreData: true })
    }

    try {
      const params = {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize
      }

      // 调用后端 API
      const res = await getTopicListApi(params) as { rows: any[], total: number }

      const newList = res.rows || []
      const oldList = reset ? [] : this.data.topicList
      
      this.setData({
        topicList: oldList.concat(newList), // 拼接新旧数据
        total: res.total,
        loading: false,
        hasMoreData: (this.data.pageNum * this.data.pageSize) < res.total
      })

    } catch (error) {
      console.error("加载帖子失败", error)
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      wx.stopPullDownRefresh() // 停止下拉刷新动画
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.loadTopics(true) // 重置并加载第一页
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.loadMoreTopics()
  },

  /**
   * 滚动到底部加载更多
   */
  loadMoreTopics() {
    if (!this.data.hasMoreData || this.data.loading) return

    // 页码+1
    this.setData({
      pageNum: this.data.pageNum + 1
    })

    this.loadTopics(false) // 加载下一页
  }
})