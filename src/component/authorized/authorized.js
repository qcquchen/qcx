import * as util from '../../js/utils'
var app = getApp()

Component({
	options: {
		multipleSlots: true
	},
	properties: {

	},
	data: {
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		isAuthorized: true
	},
	methods: {
		/*共有方法*/
		bindGetUserInfo: function(e) {
	        this.setData({
				isAuthorized: !this.data.isAuthorized
			})
			const { callback } = app.globalData.entities
	        app.getWechatInfo().then(() => {
	          const { token, phone } = app.globalData.entities.loginInfo
	          callback(token, 'authorized')
	        })
		},
		hideDialog: function(){
			this.setData({
				isAuthorized: !this.data.isAuthorized
			})
		},
		 _cancelEvent(){
	      //触发取消回调
	      this.triggerEvent("cancelEvent")
	    }
	}
})