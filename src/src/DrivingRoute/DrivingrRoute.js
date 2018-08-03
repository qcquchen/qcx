

var app = getApp()
// 页面基础配置
Page({
  data: {
    demoItem: {
      aaa: '上帝三街',
      bbb: 'bbb',
      ccc: 'ccc'
    },
    hiddenName:true
  },
  clickMe:function(e){
    this.setData({
        hiddenName:!this.data.hiddenName
    })
  },
  Jump: function (e) {
      wx.navigateTo({
      url: `/src/CarOwner/CarOwner`
    })
  }
})





