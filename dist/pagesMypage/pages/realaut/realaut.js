// pages/mypage/realaut/realaut.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carName: '',
    carID: '',
    showModal: false
  },
  getName: function(e) {
    this.setData({
      carName: e.detail.value
    })
    console.log(this.data.carName)
  },
  getId: function(e) {
    this.setData({
      carID: e.detail.value
    })
    console.log(this.data.carID)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 实名认证成功
   */
  jumpRealautOk() {
    if (this.data.carName && this.data.carID !== '') {
      this.setData({
        showModal: true
      })
      setTimeout(() => {
        wx.redirectTo({
          url: `./realautok`
        })
      }, 1000)
    }
  }
})