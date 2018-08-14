import * as wxset from './utils/wxset';
import * as api from './utils/api'
//app.js
App({
  api,
  Data: wxset.Data,
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        this.ajax(['POST', 'driver'], [this.api.wxlogin, {
          code: res.code,
          type: 'No_1'
        }], (res) => {
          console.log(res)
        }, (res) => {
          console.log(res)
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
           wx.redirectTo({
             url: '/pages/logs/logs',
           })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    addre:'',
    revlocarion:null
  },
  ajax(e, r, t) { wxset.ajax(e, r, t) }
})