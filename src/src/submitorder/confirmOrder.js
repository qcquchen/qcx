import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'

var app = getApp()

Page({
	data:{
		countdown: app.globalData.entities.setTimeNumber || 180,
		order: {},
		price: 0
	},
	onLoad(option){
		let pay_datails = wx.getStorageSync('pay_datails')
		const { price, sharePhone, share_type, pay_type } = option
		this.setData({
			order: pay_datails,
			price: price,
			sharePhone: sharePhone,
			share_type: share_type,
			pay_type: pay_type
		})
		this.setIntervalTime(true)
	},
	setIntervalTime:function(type){
		const { sharePhone } = this.data
		let second = app.globalData.entities.setTimeNumber || 180
		let time = setInterval(() => {
			second = second - 1
			this.setData({
				countdown: second
			})
			util.setEntities({
				key: 'setTimeNumber',
				value: second
			})
			if(second <= 0){
				clearInterval(time)
				wx.switchTab({
					url: `/src/index`
				})
			}
		}, 1000)
		if(!type){
			clearInterval(time)
		}
	},
	postWxPay(){
		const { order, sharePhone, share_type, pay_type } = this.data
		const { token } = app.globalData.entities.loginInfo
		let data = pay_type == 'nopay' ? order.nopaySign.wxApp : order.wxapp
		util.toPay(data).then(res => {
			wx.showModal({
			  title: '订座成功',
			  content: '请使用此手机号登录趣出行APP,完成后续操作',
			  showCancel: false,
			  success: function(res) {
			    if (res.confirm) {
					wx.switchTab({
						url: `/src/travelList/travelList`
					})
			    }
			  }
			})
		})
	},
	closeWxPay: function(){
		const { order } = this.data
		const { token } = app.globalData.entities.loginInfo
		passenger_api.closeWxPay({
			data: {
				ordersId: order.ordersId,
				token: token
			}
		}).then(json => {
			wx.showToast({
			  title: '取消成功',
			  icon: 'success',
			  duration: 2000
			})
			setTimeout(() => {
				wx.reLaunch({
					url: `/src/index`
				})
			}, 2000)
		})
	}
})
