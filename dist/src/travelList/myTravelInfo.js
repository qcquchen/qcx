import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
import { WATER_BILL_TYPE } from '../../js/constants'
var app = getApp()

Page({
	data: {
		window: {},
		travelInfo: {},
		showMask: true,
		latitude: 23.099994,
    	longitude: 113.324520,
    	polyline: [],
    	code_type: 'down'
	},
	onLoad(options){
		const { travelId, travelType } = options
		this.setData({
	    	travelType: travelType,
			window: wx.getSystemInfoSync(),
			travelId: travelId
	    })
		switch (Number(travelType)){
	      case 4:
	        this.seckillTravelDetail(travelId)
	      break;
	      case 5:
	      case 6:
	      case 7:
	      case 8:
			this.getOrdersDetails(travelId)
	      break;
	    }
	},
	onReady: function (e) {
	    this.mapCtx = wx.createMapContext('map')
	},
	getOrdersDetails: function(id){
		const { token } = app.globalData.entities.loginInfo
		passenger_api.getOrdersDetails({
			data: {
				token: token,
				ordersTravelId: id
			}
		}).then(json => {
			let data = json.data.travel
			data.startTimeText = moment(data.startTime).toDate().pattern('M月d日HH:mm')
			data.recommendStartTimeText = moment(data.recommendStartTime).toDate().pattern('M月d日HH:mm')
			data.departureTime = moment(data.recommendStartTime).toDate().pattern('HH:mm')
			this.planningRoutes(data.driverStart, data.driverEnd)
			this.addMarkes(data)
			this.setData({
				travelInfo: data,
				api_type: 'get_order'
			})
		})
	},
	seckillTravelDetail: function(id){
		const { token } = app.globalData.entities.loginInfo
		passenger_api.seckillTravelDetail({
	  		data: {
	  			token: token,
	  			travelId: id
	  		}
	  	}).then(json => {
			let data = json.data.travel
			data.startTimeText = moment(data.startTime).toDate().pattern('M月d日HH:ss')
			this.planningRoutes(data.driverStart, data.driverEnd)
			this.addMarkes(data)
			this.setData({
				travelInfo: data,
				api_type: 'seckill_order'
			})
	  	})
	},
	planningRoutes: function(start, end){
		let parmas = Object.assign({}, {start: start}, {end: end})
		util.getPlanning(parmas).then(json => {
			let polyline = [{
				points: json.points,
				color:"#499EF8",
				width: 10,
				dottedLine: false,
				arrowLine: true,
				borderColor: '#458A53',
				borderWidth: 1
			}]
			this.setData({
				polyline: polyline
			})
		})
	},
	callPhone: function(){
		const { travelInfo } = this.data
		if(travelInfo.driverPhone == null){
			wx.showToast({
			  title: '呼叫失败',
			  icon: 'success',
			  duration: 2000
			})
			return
		}
		wx.makePhoneCall({
		  phoneNumber: String(travelInfo.driverPhone) 
		})
	},
	customerService: function(){
		wx.makePhoneCall({
		  phoneNumber: '89940360'
		})
	},
	showMaskLayer: function(e){
		const { currentTarget: { dataset:{ type } } } = e
		this.setData({
			maskType: type,
			showMask: false
		})
	},
	hideMaskLayer: function(){
		this.setData({
			showMask: true
		})
	},
	gotoStartAdd: function(){
		const { travelInfo } = this.data
	    wx.openLocation({
	      latitude: travelInfo.recommendStart[1],
	      longitude: travelInfo.recommendStart[0],
	      scale: 28,
	      name: travelInfo.recommendStartAddress
	    })
	},
	gotoEndAdd: function(){
		const { travelInfo } = this.data
	    wx.openLocation({
	      latitude: travelInfo.recommendEnd[1],
	      longitude: travelInfo.recommendEnd[0],
	      scale: 28,
	      name: travelInfo.recommendEndAddress
	    })
	},
	typeFourPay: function(){
		const { travelInfo, travelId } = this.data
	    if(travelInfo.bookSeats == 0){
	        wx.showModal({
				title: '提示',
				content: '暂无余座',
				showCancel: false
			})
	      return
	    }
		let parmas = Object.assign({}, {bookSeats: travelInfo.bookSeats}, {travelId: travelId}, { price: travelInfo.price }, {startAddress: travelInfo.driverStartAddress}, {endAddress: travelInfo.driverEndAddress}, {start: travelInfo.driverStart}, {end: travelInfo.driverEnd})
		util.setEntities({
	      key: 'order_info',
	      value: parmas
	    })
	    wx.redirectTo({
	      url: `/src/submitorder/submitorder?bookSeats=${parmas.bookSeats}&price=${parmas.price}&travelId=${parmas.travelId}&share_type=other`
	    })
	},
	redirection: function(){
		this.mapCtx.moveToLocation()
	},
	codeUp: function(){
		this.setData({
			code_type: 'up'
		})
	},
	codeDown: function(){
		this.setData({
			code_type: 'down'
		})
	},
	clickUpCar: function(){
		const { token } = app.globalData.entities.loginInfo
		const { travelId } = this.data
		let self = this
		wx.showModal({
		    title: '提示',
		    content: '车主已到达指定位置了吗？',
		    success: function(res){
		    	if (res.confirm) {
			      passenger_api.clickOnTheTrain({
						data: {
							token: token,
							ordersTravelId: travelId
						}
					}).then(json => {
						if(json.data.status == 200){
							wx.showToast({
							  title: '已上车',
							  icon: 'success',
							  duration: 2000
							})
							self.getOrdersDetails(travelId)
						}
					})
			    }
		    }
		})
	},
	endOfItinerary: function(){
		const { token } = app.globalData.entities.loginInfo
		const { travelId } = this.data
		let self = this
		wx.showModal({
		    title: '提示',
		    content: '已到达指定下车位置了吗？',
		    success: function(res){
		    	if (res.confirm) {
			      passenger_api.passengerDown({
						data: {
							token: token,
							ordersTravelId: travelId
						}
					}).then(json => {
						if(json.data.status == 200){
							wx.showToast({
							  title: '已完成行程',
							  icon: 'success',
							  duration: 2000
							})
							self.getOrdersDetails(travelId)
						}
					})
			    }
		    }
		})
	},
	cancelTheTrip: function(){
		const { token } = app.globalData.entities.loginInfo
		const { travelId } = this.data
		let self = this
		wx.showModal({
		    title: '提示',
		    content: '确定要取消行程嘛？',
		    success: function(res){
		    	if (res.confirm) {
			      passenger_api.deletePeopleTravel({
						data: {
							token: token,
							ordersTravelId: travelId
						}
					}).then(json => {
						if(json.data.status == 110){
							wx.switchTab({
							  url: `/src/travelList/travelList`
							})
						}
						if(json.data.status == -110){
							wx.showModal({
							    title: '提示',
							    content: '今日取消次数用完啦~',
							    showCancel: false
							})
						}
						if(json.data.status == -123){
							wx.showToast({
							  title: '已发车',
							  icon: 'success',
							  duration: 2000
							})
						}
						self.setData({
							showMask: true
						})
					})
			    }
		    }
		})
	},
	markedLate: function(){
		const { token } = app.globalData.entities.loginInfo
		const { travelId } = this.data
		let self = this
		wx.showModal({
		    title: '提示',
		    content: '车主迟到了吗？',
		    success: function(res){
		    	if (res.confirm) {
			      passenger_api.markedLate({
						data: {
							token: token,
							ordersTravelId: travelId
						}
					}).then(json => {
						if(json.data.status == 200){
							wx.showToast({
							  title: '已吐槽！',
							  icon: 'success',
							  duration: 2000
							})
							self.setData({
								showMask: true
							})
						}
					})
			    }
		    }
		})
	},
	gotoWxPay: function(){
		const { token } = app.globalData.entities.loginInfo
		passenger_api.getUnpaidOrders({
			data: {
				token: token
			}
		}).then(json => {
			wx.setStorageSync('pay_datails', json.data)
			wx.redirectTo({
				url: `/src/submitorder/confirmOrder?pay_type=nopay`
			})
		})
	},
	addMarkes: function(data, type){
	    let markers = [{
	      iconPath: '../../images/icon_map_star@3x_two.png',
	      id: 0,
	      latitude: data.driverStart[1],
	      longitude: data.driverStart[0],
	      width: 32,
	      height: 47,
	      label: {
	      	content: data.driverStartAddress,
	      	color: '#484848',
	      	fontSize: 14
	      }
	    },{
	      iconPath: '../../images/icon_map_end@3x_two.png',
	      id: 1,
	      latitude: data.driverEnd[1],
	      longitude: data.driverEnd[0],
	      width: 32,
	      height: 47,
	      label: {
	      	content: data.driverEndAddress,
	      	color: '#484848',
	      	fontSize: 14
	      }
	    }]
		this.setData({
			markers: markers
		})
  },
  postAttention: function(){
  	const { travelInfo, api_type, travelId } = this.data
  	const { token } = app.globalData.entities.loginInfo
  	driver_api.postAttention({
  		data: {
  			token: token,
  			attentione: travelInfo.driverPhone
  		}
  	}).then(json => {
  		if(json.data.status == 200){
			api_type === 'get_order' ? this.getOrdersDetails(travelId) : this.seckillTravelDetail(travelId)
			wx.showToast({
			  title: '已关注',
			  icon: 'success',
			  duration: 2000
			})
		}
  	})
  },
  removeAttention: function(){
  	const { travelInfo, api_type, travelId } = this.data
  	const { token } = app.globalData.entities.loginInfo
  	driver_api.pullAttention({
  		data: {
  			token: token,
  			attentionPhone: travelInfo.driverPhone
  		}
  	}).then(json => {
  		if(json.data.status == 200){
			api_type === 'get_order' ? this.getOrdersDetails(travelId) : this.seckillTravelDetail(travelId)
				wx.showToast({
				  title: '已取消关注',
				  icon: 'success',
				  duration: 2000
				})
		}
  	})
  },
  closeWxPay: function(id){
    const { token } = app.globalData.entities.loginInfo
    const { travelInfo } = this.data
    let self = this
    wx.showModal({
      title: '提示',
      content: '确定取消行程吗',
      success: function(res) {
        if (res.confirm) {
          passenger_api.closeWxPay({
            data: {
              ordersId: travelInfo.ordersId,
              token: token
            }
          }).then(json => {
            if(json.data.status == 200){
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(() => {
	              wx.switchTab({
	                url: `/src/travelList/travelList`
	              })
              }, 2000)
            }
          })
        }
      }
    })
  }
})