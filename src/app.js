import * as passenger_api from './js/passenger_api'
import * as driver_api from './js/driver_api'
import * as util from './js/utils'
import * as constants from './js/constants'


var appConfig = {
    getWechatInfo () {
      let that = this
      return new Promise ((resolve, result) => {
        util.wechatLogin().then((login) => {
          wx.getSetting({
            success: function(res){
              if(res.authSetting['scope.userInfo']){
                wx.getUserInfo({
                  success: function(user) {
                    user.userInfo.code = login.code
                    util.setStorage({
                      key : 'wechatInfo',
                      data : user.userInfo
                    })
                    that.weChatSignin(user.userInfo, resolve, result)
                  }
                })
                app.globalData.isAuthorized = false
              }else{
                util.denyAuthorization('login')
                // app.globalData.isAuthorized = true
              }
            }
          })
        })
      })
    },
    globalData: {
      appLaunch      : false,
      isAuthorized   : false,
      callback       : null,
      unloadCallback : null,
      hasLogin       : false,
      wechatInfo     : null,
      userInfo       : null,
      wechatConfig   : {},
      entities       : {
        deviceInfo : wx.getSystemInfoSync(),
        loginInfo: {}
      }
    },
    weChatSignin (options, solve, sult) {
      const that = this
      const { code } = options
      let parmas = Object.assign({}, {code: code}, {type: 'No_1'})
      driver_api.postWechatLogin({
        data: parmas
      }).then(login_json => {
        let openId = login_json.data.result.Openid
        this.globalData.entities.loginInfo = {
            openId: openId
          }
        this.postFindLogin(openId, solve, sult)
      })
    },
    postFindLogin(openId, solve, sult){
      driver_api.postFindLogin({
        data: {
          openId: openId
        }
      }).then(json => {
        let { status } = json.data
        if(status != -1){
          json.data.openId = openId
          json.data.isLogin = false
          this.globalData.entities.loginInfo = json.data
          util.setStorage({
            key : 'first_userInfo',
            data : json.data
          })
          this.globalData.appLaunch = true
          solve()
        }else{
          this.globalData.entities.loginInfo = {
            openId: openId,
            isLogin: false
          }
          this.globalData.appLaunch = true
          sult()
        }
      })
    }
}

App(appConfig)

export var app = getApp()
