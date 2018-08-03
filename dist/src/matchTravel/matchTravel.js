import moment from '../../js/moment.js'
import * as PublicLi from '../../js/PublicLi.js'
import * as driver_api from '../../js/driver_api.js'
var app=getApp()
var day = PublicLi.selectDay()
var hour = PublicLi.selectHour()
var minute = PublicLi.selectMinute()
Page({
	data: {
		end_addr: '',
	    start_addr: '',
	    history_L: [],
	    page: 1,
	    selfTravel: {},
	    updateShow: false,
	    showOperating: false,
		showModal: false,
		timeValue: [0, 0, 0],
		days: day.showDayArray,
	    hours: hour.showHourArray,
	    minutes: minute.showMinuteArray
	},
	  //1>起始点的搜索
    getLocation: function(e){
	    let self = this
	    const { currentTarget: { dataset: { id } } } = e
	    const { longitude, latitude, start_addr, end_addr, history_L, end_loc, start_loc, page } = this.data
	    wx.chooseLocation({
	      success: function(res){
	        if(id === 'start'){
	          self.setData({
	          start_addr: res.name,
	          start_loc: [res.longitude, res.latitude]
	          })
	          if(end_addr === '') return
	            let parmas = Object.assign({}, {start_addr: res.name}, {start_loc: [res.longitude, res.latitude]}, {end_addr: end_addr}, {end_loc: end_loc})
	          history_L.push(parmas)
	          PublicLi.setStorageSync({
	            key: 'historyLine',
	            data: history_L
	          })
	          self.searchTravel(res.name, [res.longitude, res.latitude], end_addr, end_loc, page)
	        }else{
	            let parmas = Object.assign({}, {start_addr: start_addr}, {start_loc: start_loc}, {end_addr: res.name}, {end_loc: [res.longitude, res.latitude]})
	          self.setData({
	            end_addr: res.name,
	            end_loc: [res.longitude, res.latitude]
	          })
	          history_L.push(parmas)
	          PublicLi.setStorageSync({
	            key: 'historyLine',
	            data: history_L
	          })
	          self.searchTravel(start_addr, start_loc, res.name, [res.longitude, res.latitude], page)
	        }
	      }
	    })
    },
    //2>将值传向后台，向后台发送请求
    searchTravel: function(start_addr, start_loc, end_addr, end_loc, page){
	    wx.showToast({
	      title: '加载中',
	      icon: 'loading',
	      duration: 2000
	    })
	    const { token } = app.globalData.entities.loginInfo
	    let parmas = Object.assign({}, {token: token}, {startAddress: start_addr}, {startLocation: start_loc}, {endAddress: end_addr}, {endLocation: end_loc}, {pageNo: page})
	    driver_api.searchTravel({
	      data: parmas
	    }).then(json => {
	      if(json.data.status == 200){
	        let { groupLines, searchTravels } = json.data
	        let new_groupLines = []
	        searchTravels && searchTravels.map(json => {
	          if(json.travelVo.surplusSeats != 0){
	            let seat_true = util.seats_true(json.travelVo.seats - json.travelVo.surplusSeats)
	            let seat_false = util.seats_false(json.travelVo.surplusSeats)
	            json.travelVo.seat_true = seat_true
	            json.travelVo.seat_false = seat_false
	          }else{
	            let seat_true = util.seats_true(json.travelVo.seats)
	            json.travelVo.seat_true = seat_true
	          }
	        })
	        groupLines && groupLines.map((json, index) => {
	          if(index < 3){
	            new_groupLines.push(json)
	          }
	        })
	        this.setData({
	          groupLines: new_groupLines,
	          searchTravels: searchTravels,
	          history_type: false
	        })
	      }
	    })
    },
	  //变换起始点向后台请求返回数据
	convertLoc: function(){
	    const { start_addr, end_addr, history_L, start_loc, end_loc, page } = this.data
	    if(end_addr === '') return
	    let parmas = Object.assign({}, {start_addr: end_addr}, {end_addr: start_addr}, {start_loc: end_loc}, {end_loc: start_loc})
	    history_L.push(parmas)
	    this.setData({
	      start_addr: end_addr,
	      end_addr: start_addr,
	      end_loc: start_loc,
	      start_loc: end_loc
	    })
	    PublicLi.setStorageSync({
	      key: 'historyLine',
	      data: history_L
	    })
	    this.searchTravel(parmas.start_addr, parmas.start_loc, parmas.end_addr, parmas.end_loc, page)
	},
	// 乘车时间
	clickShowOperating: function(){
		const { showOperating, travelType, selfTravel, updateShow } = this.data
		let type = travelType == '0' ? 'people' : 'owner'
		let seatsArray = PublicLi.seatsNumber(type)
		this.setData({
			showOperating: !showOperating,
			seatsArray: seatsArray,
			seatsVal: selfTravel.seats
		})
	},
	bindTimeChange: function(e) {
		const val = e.detail.value
		this.setData({
			bindTimeVal: val
		})
	},
    // 存为常用路线对话框
 	showDialogBtn: function () {
 		 this.setData({
		       showModal: true
		    }),
 		setTimeout(() => {
	      	this.setData({
		       showModal: false
		    })
	    },2000),
	    wx.navigateTo({
		  url: `/src/WaitCarowner/WaitCarowner`
		})
	}
})