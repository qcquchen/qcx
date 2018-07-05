//index.js
//获取应用实例
var app = getApp()
Page( {
  data: {
    isShow: true,
    currentTab: 0,
    startAddress: '正在获取当前位置',
    endAddress:'您要去哪儿'
  },
   
    swichNav: function (e) {
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else { 
            var showMode = e.target.dataset.current == 0;
            this.setData({
                currentTab: e.target.dataset.current,
                isShow: showMode
            })
        }
    },
    gotoSearch: function (e) {
        wx.navigateTo({
        url: `/src/search/search`
      })
    }
})

