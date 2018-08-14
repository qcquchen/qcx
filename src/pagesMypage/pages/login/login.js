// pages/mypage/login/login.js
var app = getApp()
let inter;
let num;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone_false: false, 
    code_false: false,
    phone: null,
    code: null,
    countdown: '获取验证码',
    phone_type: 'no',
    code_type: 'no',
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(num){
      clearInterval(inter)
      this.setData({
        countdown: num,
        disabled: true,
      })
      inter = setInterval(() => {
        if (this.data.countdown <= 0) {
          this.setData({
            countdown: '获取验证码',
            disabled: false
          })
          clearInterval(inter);
        } else {
          num -= 1
          this.setData({
            countdown: num
          })
        }
      }, 1000)
    }
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
   * 校验手机号
   */
  inPhone: function (e) {
    if (!(/^1[3-9][0-9]\d{8}$/.test(e.detail.value))) {
      this.setData({
        phone_false: true
      })
    } else {
      this.setData({
        phone_false: false,
        phone: e.detail.value,
        phone_type: 'yes'
      })
    }
  },
  /**
   * 校验验证码
   */
  inCode: function (e) {
    // if (!(/^\d{6}$/.test(e.detail.value))) {
    //   this.setData({
    //     code_false: true,
    //     code: null
    //   })
    //   return
    // }
    this.setData({
      code_false: false,
      code: e.detail.value,
      code_type: 'yes'
    })
  },
  submit_login(){
    app.ajax(['post', 'driver'], [app.api.login, {
      "phone": this.data.phone,
      "captcha":this.data.code
    }], (res) => {
      console.log(res)
      if(res.data.status==200){
        console.log("已登录")
        var userdata = {
          phone: this.data.phone,
          token: res.data.token
        }
        wx.setStorage({
          key: "userdata",
          data: userdata
        })
        
        wx.navigateBack({
          delta:1
        })
      }
    }, (res) => {
      console.log("未登录")
    })
  },
  /**
   * 获取验证码
   */
  getCode: function (e) {
    if(!this.data.phone){
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none'
      })
      return;
    }
    let parmas = this.data.phone
   console.log(parmas)
    app.ajax(['post', 'driver'], [app.api.postSendCaptcha, {
      phone: Number(parmas) 
    }], (res) => {
      console.log(res)
      this.setData({
        countdown: 60,
        disabled: true
      })
      num = 60
      inter = setInterval(() => {
        if (this.data.countdown == 0) {
          this.setData({
            countdown: '获取验证码',
            disabled: false
          })
          clearInterval(inter);
        } else {
          num -= 1
          this.setData({
            countdown: num
          })
        }
      }, 1000)
    }, (res) => {
      console.log(res)
    })
  }
})