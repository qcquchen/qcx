// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var app = getApp()
Page({
  data: {
    isToken:true,
    isShow:true,
    currentTab: 0,
    textTop: '今天9:30',
    textBottom: '红庙北里三十五号22栋',
    address:''
  },
  onLoad: function (options) {
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'ASEBZ-O5BK4-BYUUP-X2IBS-NUQST-5CFGC' // 必填
    });
  },
  onShow: function () {
    var that = this
    var user = wx.getStorageSync('userdata');
    if (user.token) {
      that.setData({
        isToken: false,
        isShow: false
      })
    };
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            var address = res.result.formatted_addresses.recommend;
            app.globalData.addre = res.result.formatted_addresses.recommend;
            var revlocarion = res.result.location;
            var arr0 = []

            arr0[0] = revlocarion.lng;
            arr0[1] = revlocarion.lat;
            app.globalData.revlocarion = arr0;
            that.setData({
              address:address
            })
          }
        })
      },
      fail:function(){
        console.log('用户点击了拒接')
        that.setData({
          address: '正在获取当前位置'
        })
      }
    })
  },
  // 判断是否注册登录
  //主页点击滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //主页点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /**
   * 跳转到搜索页面
   */
  gotoSearch: function (e) {
    var user = wx.getStorageSync('userdata');
    if (!user.token) {
      wx.navigateTo({
        url: '/pagesMypage/pages/login/login',
      })
    }else{
      wx.navigateTo({
        url: `/pagesIndex/pages/passengerSearch/passengerSearch`
      })
    }
  },
  gotoCarOwnerReleased: function (e) {
    wx.navigateTo({
      url: `/pagesIndex/pages/CarOwnerReleased/CarOwnerReleased`
    })
  },
  gotoPassengerRoute: function (e) {
    var user = wx.getStorageSync('userdata');
    if (!user.token) {
      wx.navigateTo({
        url: '/pagesMypage/pages/login/login',
      })
    } else{
      wx.navigateTo({
        url: `/pagesIndex/pages/PassengerRoute/PassengerRoute`
      })
    }
  },
  gotoCommonCarOwners: function (e) {
    wx.navigateTo({
      url: `/pagesIndex/pages/CommonCarOwners/CommonCarOwners`
    })
  },
  gotoMakingMoney(){
    var user = wx.getStorageSync('userdata');
    if (!user.token) {
      wx.navigateTo({
        url: '/pagesMypage/pages/login/login',
      })
    } else{
      wx.navigateTo({
        url: `/pagesIndex/pages/makingMoney/makingMoney`
      })
    }
  },
  /**
   * 点击按钮跳转到车主认证页面
   */
  gotoCarowner () {
    wx.navigateTo({
      url: '/pagesMypage/pages/carowner/carowner',
    })
  }
})