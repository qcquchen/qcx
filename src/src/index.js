
var app=getApp()
Page({
  data:{
    currentTab:0,
    textTop:'今天9:30',
    textBottom:'红庙北里三十五号22栋'
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

  },
  //主页点击滑动切换
  swiperTab:function( e ){
    var that=this;
    that.setData({
      currentTab:e.detail.current
    });
  },
  //主页点击切换
  clickTab: function( e ) {  
    var that = this;  
    if( this.data.currentTab === e.target.dataset.current ) {  
      return false;  
    } else {  
      that.setData( {  
        currentTab: e.target.dataset.current  
      })  
    }  
  },
  gotoSearch: function (e) {
      wx.navigateTo({
      url: `/src/search/search`
    })
  },
  gotoCarOwnerReleased: function (e) {
      wx.navigateTo({
      url: `/src/CarOwnerReleased/CarOwnerReleased`
    })
  },
  gotoPassengerRoute:function (e) {
    wx.navigateTo({
      url: `/src/PassengerRoute/PassengerRoute`
    })
  },
  gotoCommonCarOwners:function (e) {
    wx.navigateTo({
      url: `/src/CarOwner/CommonCarOwners`
    })
  }  
})
