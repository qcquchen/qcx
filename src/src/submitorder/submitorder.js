import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
import { SUBMIT_WXPAY } from '../../js/constants'

var app = getApp()

Page({
	data: {
		seat: [],
		price: 0,
		submit_price: 0,
		insurance: false,
		popUpStatus: true,
		countdown: app.globalData.entities.setTimeNumber || 180,
	},
	onLoad(options){
		const {order_info} = app.globalData.entities
		let order = order_info ? order_info : options
		let seat = util.seats(order.bookSeats)
		seat.map((json, index) => {
	    	if(index == order.bookSeats - 1){
	    		json.type = true
	    	}else{
	    		json.type = false
	    	}
	    })
		this.setData({
			price: order.price,
			mine_seat: order.bookSeats,
			travelId: order.travelId,
			submit_price: order.isPickUp ? (order.price * order.bookSeats) + order.extraMoney : order.price * order.bookSeats,
			people_id: order.passengerTravelId,
			seat: seat,
			sharePhone: order.sharePhone,
			share_type: order.share_type,
			start: order.start,
			end: order.end,
			startAdd: order.startAddress,
			endAdd: order.endAddress,
			extraMoney: order.extraMoney,
			isPickUp: order.isPickUp,
			startTime: order.startTime,
			extraDistance: order.extraDistance
		})
	},
	selectSeat:function(e){
        const { currentTarget: { dataset: { id } } } = e
        const { seat, price, isPickUp, extraMoney } = this.data
        let new_price = 0
        seat.map((json, index) => {
        	if(index == id){
        		json.type = true
        		new_price = json.number * price
        	}else{
        		json.type = false
        	}
        })
        this.setData({
        	seat: seat,
        	submit_price: isPickUp ? new_price + extraMoney : new_price
        })
	},
	submit:function(){
		const { submit_price, travelId, seat, price, insurance, people_id, sharePhone, share_type, start, end, startAdd, endAdd, startTime, isPickUp, extraDistance } = this.data
		let mine_seat = seat.find(json => json.type == true).number
		const { token, openId } = app.globalData.entities.loginInfo
		passenger_api.postPay({
			data: {
				token: token,
				bookSeats: mine_seat,
				buyingSafety: insurance,
				isWX: true,
				openid: openId,
				travelId: travelId,
				sharerPhone: sharePhone,
				startAddress: startAdd,
				endAddress: endAdd,
				start: start,
				end: end,
				startTime: startTime,
				isPickUp: isPickUp,
				extraDistance: extraDistance
			}
		}).then(json => {
			let data = json.data
			if(data.status == -101){
				this.gotoWxPay()
				return
			}
			if(data.status != 200){
				wx.showModal({
				  title: '提示',
				  content: SUBMIT_WXPAY[data.status],
				  showCancel: data.status == -1 ? true : false,
					confirmText: data.status == -1 ? '去登录' : '确定',
				  success: function(res) {
				    if (res.confirm && data.status == -1) {
				 		wx.navigateTo({
					        url: `/src/login/login`
					    })
				    }else{
						wx.switchTab({
							url: `/src/travelList/travelList`
						})
					}
				  }
				})
				return
			}
			wx.setStorageSync('pay_datails', data)
			util.setEntities({
		      key: 'setTimeNumber',
		      value: 180
		    })
			this.setData({
				popUpStatus: false,
				order: data,
				pay_type: 'pay'
			})
			this.setIntervalTime(true)
		})
	},
	gotoWxPay: function(){
		const { token } = app.globalData.entities.loginInfo
		passenger_api.getUnpaidOrders({
			data: {
				token: token
			}
		}).then(json => {
			wx.showModal({
			  title: '提示',
			  content: '您有未支付的订单，请前往支付',
			  showCancel: false,
			  success: function(res) {
			    if (res.confirm) {
					wx.setStorageSync('pay_datails', json.data)
					wx.redirectTo({
						url: `/src/submitorder/confirmOrder?&pay_type=nopay`
					})
			    }
			  }
			})
		})
	},
	setIntervalTime:function(type){
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
			if(second <= 0 || !type){
				clearInterval(time)
				wx.switchTab({
					url: `/src/index`
				})
			}
		}, 1000)
	},
	cloasePop: function(){
		const { popUpStatus } = this.data
		this.setData({
			popUpStatus: !popUpStatus
		})
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
		let self = this
		wx.showModal({
		  title: '提示',
		  content: '确定取消订单吗?',
		  success: function(res) {
		    if (res.confirm) {
				passenger_api.closeWxPay({
					data: {
						ordersId: order.ordersId,
						token: token
					}
				}).then(json => {
					if(json.data.status == 200){
						wx.showToast({
						  title: '取消成功',
						  icon: 'success',
						  duration: 2000
						})
						self.setData({
							popUpStatus: true
						})
						self.setIntervalTime(false)
					}
				})
		    } else if (res.cancel) {
		      console.log('用户点击取消')
		    }
		  }
		})
	}
})
