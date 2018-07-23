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
	    timeValue: [0, 0, 0],
	    demoItem: {
	      aaa: '上帝三街',
	      bbb: 'bbb',
	      ccc: 'ccc'
	    }
	},
	// 乘车时间
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
	},
	// submit_one: function (e) {
 //      wx.navigateTo({
 //      url: `/src/WaitCarowner/WaitCarowner`
 //    })
 //  }
})
