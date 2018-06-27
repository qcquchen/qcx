import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'

var app = getApp()

Page({
	data:{
		countdown: '',
		order: {},
		setTimeType: true
	},
	onLoad(option){
		let pay_datails = wx.getStorageSync('pay_datails')
		const { price, sharePhone, share_type, pay_type } = option
		this.setData({
			order: pay_datails,
			sharePhone: sharePhone,
			share_type: share_type,
			pay_type: pay_type,
			countdown: app.globalData.entities.setTimeNumber
		})
		this.setIntervalTime(true)
	},
	setIntervalTime:function(type){
		console.log('this.data.countdown', this.data.countdown)
		let time = setInterval(() => {
			let number = this.data.countdown <　0 ? 180 : this.data.countdown
			let second = number - 1
			this.setData({
				countdown: second
			})
			util.setEntities({
				key: 'setTimeNumber',
				value: second
			})
			if(second <= 0){
				clearInterval(time)
				if(this.data.setTimeType){
					wx.switchTab({
						url: `/src/index`
					})
				}
			}
		}, 1000)
	},
	postWxPay(){
		const { order, sharePhone, share_type, pay_type } = this.data
		const { token } = app.globalData.entities.loginInfo
		let data = pay_type == 'nopay' ? order.nopaySign.wxApp : order.wxapp
		util.toPay(data).then(res => {
			wx.switchTab({
				url: `/src/travelList/travelList`
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
			this.setData({
				popUpStatus: true,
				countdown: 1
			})
			setTimeout(() => {
				wx.reLaunch({
					url: `/src/index`
				})
			}, 2000)
		})
	},
	onHide(){
		
	},
	onUnload(){
		this.setData({
			popUpStatus: true,
			setTimeType: false
		})
	}
})
