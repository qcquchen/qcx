// pages/index/passengerSearch/passengerSearch.js
// 引入SDK核心类
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aaa: '上帝三街',
    bbb: 'bbb',
    ccc: 'ccc',
    address: '我的位置',
    resData: [],
    value: '',
    values: '',
    dataID1: '',
    dataID2: '',
    keyShow: true,
    start:[],
    end: [], 
    revlocarion:[]
    // revStart:[]
  },
  // 关键词提示事件
  navTo(e) {
    var that = this;
    if (this.data.dataID1 == 1) {
      var revStart = e.currentTarget.dataset.item.location;
      var arr=[]
      arr[0] = revStart.lng;
      arr[1] = revStart.lat;
      that.setData({
        value: e.currentTarget.dataset.item.address,
        start: arr,
        resData: [],
        keyShow:true
      })
    } else if (this.data.dataID1 == 2) {
      var revEnd = e.currentTarget.dataset.item.location;
      var arr1 = []
      arr1[0] = revEnd.lng;
      arr1[1] = revEnd.lat;
      that.setData({
        values: e.currentTarget.dataset.item.address,
        end: arr1,
        resData: [],
        keyShow: true
      })
    }
    if(this.data.start&&this.data.end){
      var user = wx.getStorageSync('userdata');
        console.log(user.token)
        app.ajax(['post', 'driver'], [app.api.search, {
          "type": 0,
          "token": "40805e7515827e5cf89c7fa8b816d052",
          "start": this.data.start,
          "end": this.data.end,
          "pageNo": 1
        }], (res) => {
          console.log(res)
        }, (res) => {
          console.log(res)
        })
      }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      address: app.globalData.addre,
      revlocarion: app.globalData.revlocarion
    })
    if (this.data.revlocarion) {
      this.setData({
        start: this.data.revlocarion
      })
    }
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'ASEBZ-O5BK4-BYUUP-X2IBS-NUQST-5CFGC' // 必填
    });

  },

  // 起始位置地址
  searchStart(e) {
    var that = this
    that.setData({
      dataID1: e.target.dataset.id,
      keyShow:false,
      address:''
    })
    // 调用接口
    qqmapsdk.search({
      keyword: e.detail.value,
      success: function(res) {

        var resData = res.data;　　　　
        that.setData({
          resData: resData
        })
      }
    });
  },
  // 终点地址
  searchEnd(e) {
    var that = this
    that.setData({
      dataID1: e.target.dataset.id,
      keyShow: false
    })
    // 调用接口
    qqmapsdk.search({
      keyword: e.detail.value,
      success: function(res) {
        var resData = res.data;　　　　
        that.setData({
          resData: resData
        })
      }
    });
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
   * 跳转到匹配页面
   */
  submit: function(e) {
    wx.navigateTo({
      url: `../passengerIssue/passengerIssue`
    })
  }
})