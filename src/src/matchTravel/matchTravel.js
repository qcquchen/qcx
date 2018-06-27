import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
var app = getApp()
var day = util.selectDay()
var hour = util.selectHour()
var minute = util.selectMinute()

Page({
	data: {
		page: 1,
		selfTravel: {},
		travelResults: [],
		share_code: false,
		travel_type: false,
		showOperating: false,
		updateShow: false,
	    days: day.showDayArray,
	    hours: hour.showHourArray,
	    minutes: minute.showMinuteArray,
	    timeValue: [0, 0, 0]
	},
	onReady(){
		this.shareCode = this.selectComponent("#shareCode")
		let dayIndex = day.dayArray.findIndex((res) => res == moment().toDate().pattern('yyyy-MM-dd'))
		let hourIndex = hour.hourArray.findIndex((res) => res == moment().toDate().pattern('HH'))
		this.setData({
			timeValue: [dayIndex, hourIndex, 0]
		})
	},
	onLoad(options){
		const { travelId, type } = options
		const { page } = this.data
		if(type == '0'){
			this.matchTravelDrivers(travelId, page)
		}
		if(type == '1'){
			this.matchTravelPassengers(travelId, page)
		}
		wx.setNavigationBarTitle({
	      title: type == '0' ? '等待车主接单' : '等待乘客订座'
	    })
		this.setData({
			travelType: type,
			travelId: travelId
		})
	},
	matchTravelPassengers: function(id, page){
		const { token } = app.globalData.entities.loginInfo
		driver_api.matchTravelPassengers({
			data: {
				token: token,
				travelId: id,
				pageNo: page,
				role: 1
			}
		}).then(json => {
			let selfTravel = json.data.selfTravel.travelVo
			let travelResults = json.data.matchTravelPassengers.matchTravelPassengers
			this.setData({
				myTravel: json.data.selfTravel
			})
			this.travelFactory(travelResults, selfTravel)
		})
	},
	matchTravelDrivers: function(id, page){
		const { token } = app.globalData.entities.loginInfo
		driver_api.matchTravelDrivers({
			data: {
				token: token,
				travelId: id,
				pageNo: page,
				role: 0
			}
		}).then(json => {
			let selfTravel = json.data.selfTravel.travelVo
			let travelResults = json.data.matchTravelDrivers.travelResults
			this.setData({
				myTravel: json.data.selfTravel
			})
			this.travelFactory(travelResults, selfTravel)
		})
	},
	gotoTravelInfo: function(e){
		const { currentTarget: { dataset: {id, type} } } = e
    	const { phone } = app.globalData.entities.loginInfo
    	let data = this.data.selfTravel
		wx.navigateTo({
	      url: `/src/travelInfo/travelInfo?travelId=${id}&travelType=${type}&phone=${phone}&start=${data.start}&end=${data.end}&end_addr=${data.endAddress}&start_addr=${data.startAddress}`
	    })
	},
	postAttention: function(e){
		const { travelId, page, travelType } = this.data
		const { currentTarget: { dataset: { phone } } } = e
		const { token } = app.globalData.entities.loginInfo
		driver_api.postAttention({
			data: {
				token: token,
				attentione: phone
			}
		}).then(json => {
			if(json.data.status == 200){
				if(travelType == '0'){
					this.matchTravelDrivers(travelId, page)
				}
				if(travelType == '1'){
					this.matchTravelPassengers(travelId, page)
				}
			}
		})
	},
	removeAttention: function(e){
		const { travelId, page, travelType } = this.data
		const { currentTarget: { dataset: { phone } } } = e
		const { token } = app.globalData.entities.loginInfo
		driver_api.pullAttention({
			data: {
				token: token,
				attentionPhone: phone
			}
		}).then(json => {
			if(json.data.status == 200){
				if(travelType == '0'){
					this.matchTravelDrivers(travelId, page)
				}
				if(travelType == '1'){
					this.matchTravelPassengers(travelId, page)
				}
			}
		})
	},
	travelFactory: function(travelResults, selfTravel){
		travelResults && travelResults.map(json => {
			if(json.ownerSex == 1){
				json.sexTxt = '男'
			}else if(json.ownerSex == 2){
				json.sexTxt = '女'
			}else{
				json.sexTxt = '保密'
			}
			if(json.travelVo.surplusSeats != 0){
		        let seat_true = util.seats_true(json.travelVo.seats - json.travelVo.surplusSeats)
		        let seat_false = util.seats_false(json.travelVo.surplusSeats)
		        json.travelVo.seat_true = seat_true
		        json.travelVo.seat_false = seat_false
		    }else{
		        let seat_true = util.seats_true(json.travelVo.seats)
		        json.travelVo.seat_true = seat_true
		    }
			json.travelVo.seat_false && json.travelVo.seat_false.map((json, index) => {
				json.img = '../../images/img_haveseat@3x.png'
			})
			json.travelVo.seat_true && json.travelVo.seat_true.map((json_img, index_one) => {
				json_img.img = json.travelVo.headPictures[index_one]
			})
		})
		if(selfTravel.surplusSeats != 0){
	        let seat_true = util.seats_true(selfTravel.seats - selfTravel.surplusSeats)
	        let seat_false = util.seats_false(selfTravel.surplusSeats)
	        selfTravel.seat_true = seat_true
	        selfTravel.seat_false = seat_false
	    }else{
	        let seat_true = util.seats_true(selfTravel.seats)
	        selfTravel.seat_true = seat_true
	    }
		selfTravel.seat_false && selfTravel.seat_false.map((json, index) => {
			json.img = '../../images/img_haveseat@3x.png'
		})
		selfTravel.seat_true && selfTravel.seat_true.map((json_img, index_one) => {
			json_img.img = selfTravel.headPictures[index_one]
		})
		this.setData({
			selfTravel: selfTravel,
			travelResults: travelResults
		})
	},
	expandCollapse: function(){
		const { travel_type } = this.data
		this.setData({
			travel_type: !travel_type
		})
	},
	canvasShare:function(e){
		let that = this
		this.setData({
			share_code: true
		})
		wx.showToast({
	       title: '',
	       icon: 'loading',
	       duration: 2000
	    })
		let ctx_friends = wx.createCanvasContext('shareFriends')
		let { travelResults, myTravel } = this.data
		const { currentTarget: { dataset: { id, type } } } = e
		let data = type == 'mine' ? myTravel : travelResults.find(json => json.travelVo.travelId == id)
		let avatar = data.ownerPicture
		let time_icon = "../../images/icon_time@3x.png"
		let start_icon = "../../images/icon_map_star@3x.png"
		let end_icon = "../../images/icon_map_end@3x.png"
		let submit_bg = data.travelVo.type == 0 ? "../../images/btn_dingzuo@2x.png" : "../../images/btn_qiandan@2x.png"
		this.getWechatCode(data.travelVo.travelId, data.travelVo.type).then((res) => {
			util.getServiceImg(avatar).then(avatar_res => {
				let size = that.setCanvasSize()
				ctx_friends.beginPath()
				ctx_friends.rect(0, 0, size.w, 370)
				ctx_friends.setFillStyle('#ffffff')
				ctx_friends.fill()
				ctx_friends.stroke()

				ctx_friends.beginPath()
				ctx_friends.rect(0, 0, size.w, 370)
				ctx_friends.setStrokeStyle('#ffffff')
				ctx_friends.stroke()

				ctx_friends.drawImage(avatar_res, 22, 62, 50, 50)
				ctx_friends.drawImage(time_icon, 22, 120, 20, 20)
				ctx_friends.drawImage(start_icon, 22, 145, 20, 20)
				ctx_friends.drawImage(end_icon, 22, 170, 20, 20)
				ctx_friends.drawImage(submit_bg, size.w * 0.70, 225, 60, 20)
				ctx_friends.drawImage(res, 18, 280, 70, 70)

				ctx_friends.beginPath()
				ctx_friends.setLineWidth(1)
				ctx_friends.moveTo(12, 210)
				ctx_friends.lineTo(size.w * 0.95, 210)
				ctx_friends.setStrokeStyle('#EDEDF0')
				ctx_friends.stroke()

				ctx_friends.beginPath()
				ctx_friends.setLineWidth(1)
				ctx_friends.strokeRect(12, 45, size.w * 0.91, 210)
				ctx_friends.setStrokeStyle('#EDEDF0')
				ctx_friends.stroke()

				that.settextTitle(ctx_friends, data)
				//绘制图片
				ctx_friends.draw()
				wx.canvasToTempFilePath({
					canvasId: 'shareFriends',
					x: 5,
					y: 40,
					width: size.w * 0.95,
					height: 220,
					destWidth: 500,
					destHeight: 350,
					fileType: 'png',
					quality: 0,
					success: function (res) {
						let tempFilePath = res.tempFilePath
						that.setData({
							share_img: tempFilePath,
							share_Id: data.travelVo.travelId,
							share_type: data.travelVo.type,
              				draw_type: true
						})
					}
				})
			})
		})
	},
	creatShareImg: function(){
		wx.showToast({
	       title: '生成中...',
	       icon: 'loading',
	       duration: 2000
	    })
	    let self = this
		wx.canvasToTempFilePath({
			canvasId: 'shareFriends',
			success: function (res) {
				let tempFilePath = res.tempFilePath
				wx.saveImageToPhotosAlbum({
					filePath: tempFilePath,
				    success(res) {
				    	wx.showToast({
						  title: '保存成功',
						  icon: 'success',
						  duration: 2000
						})
						self.setData({
							share_code: false
						})
				    }
				})
			},
			fail: function (res) {
				wx.showToast({
				  title: '生成图片失败',
				  icon: 'none',
				  duration: 2000
				})
			}
		})
	},
	setCanvasSize: function(){	
		let size = {}
		const { windowWidth, windowHeight } = this.data
		try {
			size.w = windowWidth
			size.h = windowHeight
		} catch (e) {
			// Do something when catch error
			console.log("获取设备信息失败" + e)
		}
		return size
	},
	settextTitle: function (ctx_friends, data) {
		let that=this
		let title = data.travelVo.type == 0 ? `我是车主${data.ownerNickName}，乘客快来订座吧` : `我是乘客${data.ownerNickName}，车主快来抢单吧`
		ctx_friends.setFontSize(16)
		ctx_friends.setFillStyle("#484848")
		ctx_friends.fillText(title, 10, 30)
		ctx_friends.stroke()

		this.settextFir(ctx_friends, data)
	},
	settextFir: function (ctx_friends, data) {
		let that=this
		let size = that.setCanvasSize()
		let sex_txt = ''
	    if(data.ownerSex == 1){
	      sex_txt = '男'
	    }else if(data.ownerSex == 2){
	      sex_txt = '女'
	    }else{
	      sex_txt = '保密'
	    }
	    let name = `${data.ownerNickName}·${sex_txt}` 
		ctx_friends.setFontSize(14)
		ctx_friends.setFillStyle("#484848")
		ctx_friends.fillText(name, 80, 85)
		ctx_friends.stroke()

		this.settextCar(ctx_friends, data)
	},
	settextCar: function (ctx_friends, data) {
		let that=this
		let car_name = data.ownerCar != null ? data.ownerCar : '无'
		ctx_friends.setFontSize(12)
		ctx_friends.setFillStyle("#cccccc")
		ctx_friends.fillText(car_name, 80, 100)
		ctx_friends.stroke()

		this.settextInfo(ctx_friends, data)
	},
	settextInfo: function (ctx_friends, data) {
		let that=this
		let time = data.travelVo.startTimeTxt
		let start = data.travelVo.startAddress
		let end = data.travelVo.endAddress
		ctx_friends.setFontSize(16)
		ctx_friends.setFillStyle("#484848")
		ctx_friends.fillText(time, 45, 136)
		ctx_friends.fillText(start, 45, 160)
		ctx_friends.fillText(end, 45, 186)
		ctx_friends.stroke()

		this.settextLabel(ctx_friends, data)
	},
	settextLabel: function (ctx_friends, data) {
		let that = this
		let textSec = data.travelVo.type == 0 ? `余座${data.travelVo.surplusSeats} 每座${data.travelVo.travelPrice}元` : `${data.travelVo.seats}人乘车 合计${data.travelVo.travelPrice}元`
		ctx_friends.setFontSize(15)
		// ctx_friends.setTextAlign("center")
		ctx_friends.setFillStyle("#484848")
		ctx_friends.fillText(textSec, 30, 240)
		ctx_friends.stroke()

		this.settextTipe(ctx_friends, data)
	},
	settextTipe: function (ctx_friends) {
		let that = this
		let tipe_one = '长按识别小程序码'
		let tipe_two = '进入趣出行查看行程详情'
		ctx_friends.setFontSize(11)
		// ctx_friends.setTextAlign("center")
		ctx_friends.setFillStyle("#ABB1BA")
		ctx_friends.fillText(tipe_one, 100, 310)
		ctx_friends.fillText(tipe_two, 100, 330)
		ctx_friends.stroke()

	},
	getWechatCode: function(id, type){
		let vWindow = wx.getSystemInfoSync()
		const { phone } = app.globalData.entities.loginInfo
	    let that = this
	    return new Promise((resolve, result) => {
	      driver_api.getWechatCode({
	        data: {
	          id: id,
	          type: type,
	          page: 'src/travelInfo/travelInfo',
	          sharePhone: phone
	        }
	      }).then(json => {
	        util.getServiceImg(json.data.imgPath).then(res => {
	          resolve(res)
	        })
	        that.setData({
	          windowWidth: vWindow.windowWidth * 0.9
	        })
	      })
	    })
	},
	hideShareCode: function(){
		const { share_code } = this.data
		this.setData({
			share_code: !share_code
		})
	},
	onShareAppMessage: function (res) {
		const { share_img, share_Id, share_type, selfTravel } = this.data
		const { phone } = app.globalData.entities.loginInfo
		return {
			title: share_type == 0 ? '车找人，乘客快来订座吧' : '人找车，车主快来抢单吧',
			path: `/src/travelInfo/travelInfo?travelId=${share_Id || selfTravel.travelId}&travelType=${share_type || selfTravel.type}&phone=${phone}`,
			imageUrl: share_img
		}
	},
	clickShowOperating: function(){
		const { showOperating, travelType, selfTravel, updateShow } = this.data
		let type = travelType == '0' ? 'people' : 'owner'
		let seatsArray = util.seatsNumber(type)
		this.setData({
			showOperating: !showOperating,
			seatsArray: seatsArray,
			seatsVal: selfTravel.seats
		})
	},
	clickUpdate: function(e){
		const { currentTarget: { dataset: { id } } } = e
		const { updateShow } = this.data
		this.setData({
			updateShow: !updateShow,
			pickerType: id
		})
	},
	bindTimeChange: function(e) {
		const val = e.detail.value
		this.setData({
			bindTimeVal: val
		})
	},
	bindPeopleChange: function(e) {
		const val = e.detail.value
		this.setData({
			bindPeopleVal: val
		})
	},
	confirmTheChange: function(){
		const { bindTimeVal, pickerType, bindPeopleVal, selfTravel } = this.data
		let changeTime = null
		let changeSeats = null
		if(pickerType == 'time'){
			if(bindTimeVal){
				let changeDay = day.dayArray[bindTimeVal[0]]
				let changeHour = hour.hourArray[bindTimeVal[1]]
				let changeMinute = minute.minuteArray[bindTimeVal[2]]
				changeTime = `${changeDay} ${changeHour}:${changeMinute}:00`
			}else{
				changeTime = moment(selfTravel.startTime).toDate().pattern('yyyy-MM-dd HH:mm:ss')
			}
			if(!moment(changeTime).isAfter(moment().toDate().pattern('yyyy-MM-dd HH:mm:ss'))){
		      wx.showModal({
		        title: '提示',
		        content: '选择时间应大于当前时间',
		        showCancel: false
		      })
		      return
		    }
		}else{
			if(changeSeats == 0){
				wx.showModal({
				  title: '提示',
				  content: '修改座位数不能为0',
				  showCancel: false
				})
				return
			}
			changeSeats = bindPeopleVal[0]
		}
		this.modifyeTravel(changeTime, changeSeats, selfTravel.travelId, selfTravel.type)
	},
	modifyeTravel: function(time, seat, id, type){
		const { token } = app.globalData.entities.loginInfo
		const { showOperating, page, travelType, updateShow } = this.data
		driver_api.modifyeTravel({
			data: {
				token: token,
				travelId: id,
				type: type,
				startTime: time,
				seats: seat
			}
		}).then(json => {
			if(json.data.status == 200){
				wx.showToast({
		            title: '修改成功',
		            icon: 'success',
		            duration: 2000
		        })
		        if(travelType == '0'){
					this.matchTravelDrivers(id, page)
				}
				if(travelType == '1'){
					this.matchTravelPassengers(id, page)
				}
				this.setData({
					showOperating: !showOperating,
					updateShow: !updateShow
				})
		        return
			}
		})
	},
	cancelTravel: function(){
		const { selfTravel } = this.data
		if(selfTravel.type == 1){
			this.beforePassengerDelete()
		}else{
			this.deleteTravel()
		}
	},
	beforePassengerDelete: function(e){
		const { token } = app.globalData.entities.loginInfo
		const { selfTravel } = this.data
		let self = this
		// const { currentTarget: { dataset: { id, type, pid } } } = e
		wx.showModal({
		  title: '提示',
		  content: '确定取消行程吗',
		  success: function(res) {
		    if (res.confirm) {
		      passenger_api.beforePassengerDelete({
		        data: {
		          token: token,
		          passengerTravelId: selfTravel.travelId
		        }
		      }).then(json => {
		        if(json.data.status == -4){
		          wx.showModal({
		            title: '提示',
		            content: '今天的取消次数已用尽',
		            showCancel: false
		          })
		          return
		        }
		        if(json.data.status == 110){
		          wx.showToast({
		            title: '取消成功',
		            icon: 'success',
		            duration: 2000
		          })
		          setTimeout(() => {
		          	wx.switchTab({
					  url: `/src/index`
					})
		          })
		        }
		      })
		    }
		  }
		})
	},
	deleteTravel: function(e){
		const { token } = app.globalData.entities.loginInfo
		let self = this
		const { selfTravel } = this.data
		wx.showModal({
		  title: '提示',
		  content: '确定取消行程吗',
		  success: function(res) {
		    if (res.confirm) {
		      driver_api.deleteTravel({
		        data: {
		          token: token,
		          travelId: selfTravel.travelId
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
					  url: `/src/findTravel/findTravel`
					})
		          })
		        }
		      })
		    }
		  }
		})
	},
	callService: function(){
		wx.makePhoneCall({
		  phoneNumber: '89940360'
		})
	}
})