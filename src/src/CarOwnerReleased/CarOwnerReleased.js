var app = getApp()
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
      url: `/src/DrivingRoute/DrivingrRoute`
    })
  }
})





