import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
var app = getApp()

Page({
  data: {
    video_height: 0,
    end_addr: '',
    start_addr: '',
    history_L: [],
    history_type: true,
    page: 1,
    groupLines: [],
	  searchTravels: []
  },
  onLoad(){
    let self = this
  	util.loactionAddress(this.initData).then(res => {
      self.initData(res)
    })
  },
  initData(parmas){
    this.setData({
      video_height: wx.getSystemInfoSync(),
      start_addr: parmas.startAddress,
      start_loc: [parmas.longitude, parmas.latitude],
      longitude: parmas.longitude,
      latitude: parmas.latitude,
      history_L: wx.getStorageSync('historyLine').length !== 0 ? wx.getStorageSync('historyLine') : []
    })
  },
  getLocation: function(e){
  	let self = this
    const { currentTarget: { dataset: { id } } } = e
    const { longitude, latitude, start_addr, end_addr, history_L, end_loc, start_loc, page } = this.data
    wx.chooseLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28,
      success: function(res){
	      if(id === 'start'){
	      	self.setData({
		  		start_addr: res.name,
		  		start_loc: [res.longitude, res.latitude]
	      	})
	      	if(end_addr === '') return
  	  	    let parmas = Object.assign({}, {start_addr: res.name}, {start_loc: [res.longitude, res.latitude]}, {end_addr: end_addr}, {end_loc: end_loc})
  	  		history_L.push(parmas)
      		util.setStorageSync({
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
	      	util.setStorageSync({
	      		key: 'historyLine',
	      		data: history_L
	      	})
	      	self.searchTravel(start_addr, start_loc, res.name, [res.longitude, res.latitude], page)
	      }
      }
    })
  },
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
  	util.setStorageSync({
  		key: 'historyLine',
  		data: history_L
  	})
  	this.searchTravel(parmas.start_addr, parmas.start_loc, parmas.end_addr, parmas.end_loc, page)
  },
  clickHistory: function(e){
  	const { currentTarget: { dataset: { id } } } = e
  	const { history_L, page } = this.data
  	this.setData({
  		start_addr: history_L[id].start_addr,
  		end_addr: history_L[id].end_addr,
  		start_loc: history_L[id].start_loc,
  		end_loc: history_L[id].end_loc
  	})
  	this.searchTravel(history_L[id].start_addr, history_L[id].start_loc, history_L[id].end_addr, history_L[id].end_loc, page)
  },
  searchTravel: function(start_addr, start_loc, end_addr, end_loc, page){
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
  joinGroup: function(e){
  	const { currentTarget: { dataset: { id } } } = e
    const { token, phone } = app.globalData.entities.loginInfo
    const { start_addr, start_loc, end_addr, end_loc, page } = this.data
    let parmas = Object.assign({}, {token: token}, {phones: phone}, { groupId: [id] })
    driver_api.postJoinGroup({data: parmas}).then(json => {
      if(json.data.status == 200){
        wx.showToast({
          title: '已加入',
          icon: 'success',
          duration: 2000
        })
        this.searchTravel(start_addr, start_loc, end_addr, end_loc, page)
      }
    })
  },
  leaveGroup: function(e){
    const { currentTarget: { dataset: { id } } } = e
    const { token } = app.globalData.entities.loginInfo
    const { start_addr, start_loc, end_addr, end_loc, page } = this.data
    driver_api.leaveGroup({
      data: {
        token: token,
        groupId: id
      }
    }).then(json => {
      if(json.data.status === 200){
        wx.showToast({
          title: '取消关注',
          icon: 'success',
          duration: 2000
        })
        this.searchTravel(start_addr, start_loc, end_addr, end_loc, page)
      }
    })
  },
  likeHe: function(e){
  	const { currentTarget: { dataset: { id } } } = e
    const { token } = app.globalData.entities.loginInfo
    const { start_addr, start_loc, end_addr, end_loc, page } = this.data
  	driver_api.postAttention({
  		data: {
  			token: token,
  			attentione: id
  		}
  	}).then(json => {
  		if(json.data.isAttention == 1 || json.data.isAttention == 2){
  			wx.showToast({
          title: '已关注',
          icon: 'success',
          duration: 2000
        })
      	this.searchTravel(start_addr, start_loc, end_addr, end_loc, page)
  		}
  	})
  },
  pullAttention: function(e){
    const { currentTarget: { dataset: { id } } } = e
    const { token } = app.globalData.entities.loginInfo
    const { start_addr, start_loc, end_addr, end_loc, page } = this.data
    driver_api.pullAttention({
      data: {
        token: token,
        attentionPhone: id
      }
    }).then(json => {
      if(json.data.isAttention === 0){
        wx.showToast({
          title: '取消关注',
          icon: 'success',
          duration: 2000
        })
        this.searchTravel(start_addr, start_loc, end_addr, end_loc, page)
      }
    })
  },
  postLike: function(e){
    const { token } = app.globalData.entities.loginInfo
    const { currentTarget: { dataset: { id } } } = e
    const { start_addr, start_loc, end_addr, end_loc, page } = this.data
    driver_api.postLike({
      data: {
        token: token,
        travelId: id
      }
    }).then(json => {
      if(json.data.status === 200){
          wx.showToast({
            title: '已点赞',
            icon: 'success',
            duration: 2000
          })
          this.searchTravel(start_addr, start_loc, end_addr, end_loc, page)
      }
    })
  },
  travelUnlike: function(e){
    const { token } = app.globalData.entities.loginInfo
    const { currentTarget: { dataset: { id } } } = e
    const { start_addr, start_loc, end_addr, end_loc, page } = this.data
    driver_api.travelUnlike({
      data: {
        token: token,
        travelId: id
      }
    }).then(json => {
      if(json.data.status === 200){
          wx.showToast({
            title: '取消点赞',
            icon: 'success',
            duration: 2000
          })
          this.searchTravel(start_addr, start_loc, end_addr, end_loc, page)
      }
    })
  },
  gotoLineInfo: function(e){
    const { currentTarget: { dataset: { id, type } } } = e
    wx.redirectTo({
      url: `/src/lineInfo/lineInfo?groupId=${id}&groupType=${type}`
    })
  },
  gotoTravelShare: function(e){
    const { currentTarget: { dataset: { id, type } } } = e
    const { phone } = app.globalData.entities.loginInfo
    wx.redirectTo({
      url: `/src/shareTravelDetails/shareTravelDetails?travelId=${id}&travelType=${type}&phone=${phone}`
    })
  },
  showLoading: function(){
    wx.showLoading({
      title: '加载中',
    })
  },
  clearHistory: function(){
    util.setStorageSync({
      key: 'historyLine',
      data: []
    })
    this.setData({
      history_L: []
    })
  },
  gotoLineList: function(){
    const { start_addr, end_addr, start_loc, end_loc, page } = this.data
    wx.navigateTo({
      url: `/src/lineInfo/linePeopleList?start=${start_loc}&end=${end_loc}&start_addr=${start_addr}&end_addr=${end_addr}&type=search`
    })
  }
})
