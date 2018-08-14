// pages/index/driverOwner/driverOwner.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    demoItem: {
      aaa: '上帝三街',
      bbb: 'bbb',
      ccc: 'ccc'
    }
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
  // 存为常用路线对话框
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  onCancel: function () {
    this.hideModal();
  },
  onConfirm: function () {
    this.hideModal();
  },
  // BulletBox:function(){
  // 	wx.showToast({
  //      title: '发布成功',
  //      icon: 'Loading',
  //      duration: 2000//持续的时间
  //    })
  // },
  // 发布成功对话框
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
      url: `../WaitingPassengers/WaitingPassengers`
      })
  }
})