import * as util from '../../js/utils'

Page({
	data: {
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},
	bindGetUserInfo: function(e) {
		wx.getSetting({
			success: function(res){
				if(res.authSetting['scope.userInfo']){
					wx.navigateBack({
					  delta: 1
					})
				}else{
					console.log('用户点击了拒绝')
				}
			}
		})
	}
})