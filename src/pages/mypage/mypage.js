// pages/mypage/mypage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var user = wx.getStorageSync('userdata');

    if (user) {
      if (user.phone) {
        var str = user.phone.slice(7, 11) + '用户'
        this.setData({
          name: str,
          status: true
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 跳转到我的行程页面
   */
  jumpJourney() {
    wx.navigateTo({
      url: '/pagesMypage/pages/journey/journey',
    })
  },
  /**
   * 跳转到我的余额页面
   */
  jumpBalance() {
    wx.navigateTo({
      url: '/pagesMypage/pages/balance/balance',
    })
  },
  /**
   * 跳转到我的趣钻页面
   */
  jumpMyqc() {
    wx.navigateTo({
      url: '/pagesMypage/pages/myqc/myqc',
    })
  },
  /**
   * 跳转到车主认证页面
   */
  jumpCarowner() {
    wx.navigateTo({
      url: '/pagesMypage/pages/carowner/carowner',
    })
  },
  /**
   * 跳转到实名认证页面
   */
  jumpRealaut() {
    wx.navigateTo({
      url: '/pagesMypage/pages/realaut/realaut',
    })
  },
  /**
   * 跳转到芝麻信用页面
   */
  jumpSesame() {
    wx.navigateTo({
      url: '/pagesMypage/pages/sesame/sesame',
    })
  },
  /**
   * 跳转到登录页
   */
  jumpLogin() {
    wx.navigateTo({
      url: '/pagesMypage/pages/login/login',
    })
  }
})