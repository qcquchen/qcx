// pages/index/CommonCarOwners/CommonCarOwners.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    hiddenName: true,
    demoItem: {
      aaa: '上帝三街',
      bbb: 'bbb',
      ccc: 'ccc'
    },
    items: [
      { name: 'USA', value: '周一' },
      { name: 'CHN', value: '周二', checked: 'true' },
      { name: 'BRA', value: '周三' },
      { name: 'JPN', value: '周四' },
      { name: 'ENG', value: '周五' },
      { name: 'TUR', value: '周六' },
      { name: 'TUR', value: '周日' },
    ]
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
  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  // 常用添加为路线对话框
  showDialogBtn: function () {
    this.setData({
      showModal: true
    }),
      setTimeout(() => {
        this.setData({
          showModal: false
        })
      }, 2000),
      wx.navigateTo({
        url: `../MyusualRoute/MyusualRoute`
      })
  },
  gotoCarOwnerReleased: function () {
    wx.navigateTo({
      url: `../CarOwnerReleased/CarOwnerReleased`
    })
  },
  gotoDrivingRoute: function () {
    wx.navigateTo({
      url: `../DrivingRoute/DrivingRoute`
    })
  }   
})