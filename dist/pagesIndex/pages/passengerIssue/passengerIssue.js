import moment from '../../js/moment.js'

var day = PublicLi.selectDay()
var hour = PublicLi.selectHour()
var minute = PublicLi.selectMinute()

// pages/index/passengerIssue/passengerIssue.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    showOperating: false,
    showModal: false,
    timeValue: [0, 0, 0],
    days: day.showDayArray,
    hours: hour.showHourArray,
    minutes: minute.showMinuteArray
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
    this.setData({
      showModal: false
    })
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

  // 乘车时间
  clickShowOperating: function(){
    const { showOperating, travelType, selfTravel, updateShow } = this.data
    let type = travelType == '0' ? 'people' : 'owner'
    let seatsArray = PublicLi.seatsNumber(type)
    this.setData({
      showOperating: !showOperating,
      seatsArray: seatsArray,
      seatsVal: selfTravel.seats
    })
  },
  /**
   * 存为常用路线对话框
   */
  showDialogBtn: function() {
    this.setData({
        showModal: true
      }),
      setTimeout(() => {
        wx.navigateTo({
          url: `../WaitCarowner/WaitCarowner`
        })
      }, 500)
  }
})