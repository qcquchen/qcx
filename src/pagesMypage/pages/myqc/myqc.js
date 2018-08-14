// pages/mypage/myqc/myqc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sellShow: true,
    showPayPwdInput: false,  //是否展示密码输入层
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点
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
  /**
   * 跳转到QC排行榜
   */
  jumpBillboard() {
    wx.navigateTo({
      url: './Billboard/Billboard',
    })
  },
  sell() {
    this.setData({
      sellShow: false
    })
  },
  hiddX() {
    this.setData({
      sellShow: true
    })
  },
  /**
  * 显示支付密码输入层
  */
  showInputLayer: function () {
    this.setData({ showPayPwdInput: true, payFocus: true });
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function () {

    var val = this.data.pwdVal;

    this.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '' }, function () {
      wx.showToast({
        title: val,
      })
    });

  },
  /**
   * 获取焦点
   */
  getFocus: function () {
    this.setData({ payFocus: true });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function (e) {
    this.setData({ pwdVal: e.detail.value });
    if (e.detail.value.length >= 6) {
      this.hidePayLayer();
    }
  }
})