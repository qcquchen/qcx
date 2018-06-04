import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
import { WATER_BILL_TYPE } from '../../js/constants'
var app = getApp()

Page({
  data: {
    video_height: {},
    travelInfo: {},
    left: ">>>",
    right: "<<<",
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [],
    polyline: [],
    switch_loc: 0,
    isAuthorized: false
  },
  onLoad(options){
    let ops = options.scene ? decodeURIComponent(options.scene).split(',') : options
    if(options.scene){
        options.travelId = ops[0]
        options.phone = ops[1]
        options.travelType = ops[2]
    }
    this.setData({
    	options: options,
    	video_height: wx.getSystemInfoSync()
    })
  },
  onShow(){
    let self = this
    // util.setEntities({
    //   key: 'callback',
    //   value: this.initData
    // })
    app.getWechatInfo().then(() => {
      wx.showLoading({
        title: '加载中',
      })
      self.initData(null, 'authorized')
    })
    // util.isAuthorized().then((res) => {
    //   if(res == 'authorized'){
    //   }else{
    //     self.setData({
    //       isAuthorized: true
    //     })
    //   }
    // })
    // app.getWechatInfo().then(() => {
    //   this.initData()
    // })
  },
  initData(){
    const { options } = this.data
  	util.loactionAddress().then(res => {
  		this.setData({
  			myLoc: res,
        isAuthorized: false
  		})
  		this.eachFeedTravelDetail(options.travelId, options.travelType)
      // this.beforeTravelInfo(options.travelId, options.travelType)
    })
  },
  // beforeTravelInfo: function(id, type){
  //   const { token } = app.globalData.entities.loginInfo
  //   const { myLoc } = this.data
  //   driver_api.beforeTravelInfo({
  //     data: {
  //       token: token,
  //       travelId: id,
  //       type: type
  //     }
  //   }).then(json => {
  //     console.log(json,'----------json')
  //     let data = json.data.unOrderDriverTravelDetail
  //     if(data.surplusSeats != 0){
  //       let seat_true = util.seats_true(data.seats - data.surplusSeats)
  //       let seat_false = util.seats_false(data.surplusSeats)
  //       data.seat_true = seat_true
  //       data.seat_false = seat_false
  //     }else{
  //       let seat_true = util.seats_true(data.seats)
  //       data.seat_true = seat_true
  //     }
  //     data.seat_false && data.seat_false.map((json, index) => {
  //       json.img = '../../images/img_haveseat@3x.png'
  //     })
  //     data.seat_true && data.seat_true.map((json, index_one) => {
  //       data.headPictures && data.headPictures.map((res, index) => {
  //         if(index_one == index){
  //           json.img = res
  //         }
  //       })
  //     })
  //     if(this.data.travelInfo_updateLoc != 'update'){
  //       this.setData({
  //         recommend_start_loc: data.recommendLocationStart,
  //         recommend_start_add: type == '0' ? data.recommendLocationStartAddress : data.startAddress,
  //         recommend_end_loc: data.recommendEnd,
  //         recommend_end_add: type == '0' ? data.recommendEndAddress : data.endAddress,
  //         travelInfo: data
  //       })
  //       this.planningRoutes(type)
  //       this.starting_distance(myLoc.startLocation, data.start)
  //       this.end_distance(data.end)
  //       if(type != 1){
  //         this.walk_startDis(myLoc.startLocation, data.start)
  //         this.walk_endDis(data.recommendEnd)
  //       }
  //     }
  //     this.addMarkes(data, type)
  //   })
  // },
  eachFeedTravelDetail: function(id, type){
  	const { token } = app.globalData.entities.loginInfo
  	const { myLoc } = this.data
  	driver_api.eachFeedTravelDetail({
  		data: {
  			token: token,
  			travelId: id,
  			type: type,
  			location: myLoc.startLocation
  		}
  	}).then(json => {
  		const { eachFeedTravelDetail } = json.data
  		if(eachFeedTravelDetail.surplusSeats != 0){
        let seat_true = util.seats_true(eachFeedTravelDetail.seats - eachFeedTravelDetail.surplusSeats)
        let seat_false = util.seats_false(eachFeedTravelDetail.surplusSeats)
        eachFeedTravelDetail.seat_true = seat_true
        eachFeedTravelDetail.seat_false = seat_false
      }else{
        let seat_true = util.seats_true(eachFeedTravelDetail.seats)
        eachFeedTravelDetail.seat_true = seat_true
      }
      eachFeedTravelDetail.seat_false && eachFeedTravelDetail.seat_false.map((json, index) => {
      	json.img = '../../images/img_haveseat@3x.png'
      })
      eachFeedTravelDetail.seat_true && eachFeedTravelDetail.seat_true.map((json, index_one) => {
      	eachFeedTravelDetail.headPictures && eachFeedTravelDetail.headPictures.map((res, index) => {
          if(index_one == index){
      		  json.img = res
          }
      	})
      })
      if(this.data.travelInfo_updateLoc != 'update'){
        this.setData({
          recommend_start_loc: eachFeedTravelDetail.recommendLocationStart,
          recommend_start_add: type == '0' ? eachFeedTravelDetail.recommendLocationStartAddress : eachFeedTravelDetail.startAddress,
          recommend_end_loc: eachFeedTravelDetail.recommendEnd,
          recommend_end_add: type == '0' ? eachFeedTravelDetail.recommendEndAddress : eachFeedTravelDetail.endAddress,
          travelInfo: eachFeedTravelDetail
        })
        this.planningRoutes(type)
        this.starting_distance(myLoc.startLocation, eachFeedTravelDetail.start)
        this.end_distance(eachFeedTravelDetail.end)
        if(type != 1){
          this.walk_startDis(myLoc.startLocation, eachFeedTravelDetail.start)
          this.walk_endDis(eachFeedTravelDetail.recommendEnd)
        }
      }
      this.addMarkes(eachFeedTravelDetail, type)
  	})
  },
  planningRoutes: function(type){
  	const { travelInfo } = this.data
    let parmas = type == 0 ? Object.assign({}, {start: travelInfo.start}, {end: travelInfo.end}, {waypoints: travelInfo.waypoints}) : Object.assign({}, {start: travelInfo.start}, {end: travelInfo.end})
  	util.getPlanning(parmas).then(res => {
  		this.setData({
			polyline: [{
	          points: res.points,
	          color:"#57AD68",
	          width: 10,
	          dottedLine: false,
	          arrowLine: true,
	          borderColor: '#458A53',
	          borderWidth: 1
	        }],
	        planning_time: res.time,
	        planningDistance: res.distance
  		})
  	})
  },
  switchLoc: function(e){
  	const { currentTarget: {dataset: {type}} } = e
  	const { myLoc, recommend_start_loc, travelInfo, options } = this.data
	  let end = travelInfo.recommendStartType == 1 ? travelInfo.companyLocation : travelInfo.homeLocation
  	let switchLoc = type == 0 ? myLoc.startLocation : end
  	this.setData({
  		switch_loc: type,
  		selectLocation: switchLoc
  	})
  	if(options.travelType == '0'){
      console.log('11111111')
  		this.walk_startDis(switchLoc, recommend_start_loc)
  	}else{
  		this.starting_distance(switchLoc, recommend_start_loc)
  	}
  },
  updateLoc: function(e){
  	const { currentTarget: { dataset: { type } } } = e
  	const { myLoc, travelInfo, selectLocation, options } = this.data
  	let self = this
  	let selectStart = selectLocation ? selectLocation : myLoc.startLocation
  	let selectLoc = []
  	wx.chooseLocation({
  		success: function(res){
  			selectLoc.push(res.longitude)
  			selectLoc.push(res.latitude)
  			if(options.travelType == '0'){
	  			type === 'start' ? self.walk_startDis(selectStart, selectLoc) : self.walk_endDis(selectLoc)
          let update_add = res.name
          let update_loc = selectLoc
          type === 'start' ? self.setData({
            recommend_start_loc: update_loc,
            recommend_start_add: update_add
          }) : self.setData({
            recommend_end_loc: update_loc,
            recommend_end_add: update_add,
          })
          self.setData({
            travelInfo_updateLoc: 'update'
          })
	  			self.addMarkes(travelInfo, options.travelType)
  			}
  		}
  	})
  },
  starting_distance: function(start, end){
  	util.getDrivingRoute(start, end).then(res => {
  		this.setData({
  			start_distance: res
  		})
  	})
  },
  end_distance: function(start){
  	const { travelInfo } = this.data
	let end = travelInfo.recommendStartType == 1 ? travelInfo.homeLocation : travelInfo.companyLocation
  	util.getDrivingRoute(start, end).then(res => {
  		this.setData({
  			end_distance: res
  		})
  	})
  },
  walk_startDis: function(start, end){
  	util.getWalkingRoute(start, end).then(res　=> {
  		this.setData({
  			start_walk: res
  		})
  	})
  },
  walk_endDis: function(start){
  	const { travelInfo } = this.data
	let end = travelInfo.recommendStartType == 1 ? travelInfo.homeLocation : travelInfo.companyLocation
  	util.getWalkingRoute(start, end).then(res　=> {
  		this.setData({
  			end_walk: res
  		})
  	})
  },
  callPhone: function(e){
  	const { currentTarget: { dataset: {id} } } = e
  	if(id){
	  	wx.makePhoneCall({
		  phoneNumber: String(id)
		})
  	}
  },
  bookNow: function(){
  	const { travelInfo, options, recommend_start_loc, recommend_start_add, recommend_end_loc, recommend_end_add } = this.data
	    if(travelInfo.surplusSeats == 0){
	      wx.showModal({
				title: '提示',
				content: '暂无余座',
				showCancel: false
			})
	      return
	    }
		let parmas = Object.assign({}, {bookSeats: travelInfo.surplusSeats}, {travelId: travelInfo.travelId}, { price: travelInfo.travelPrice }, { sharePhone: options.phone }, {startAddress: recommend_start_add}, {endAddress: recommend_end_add}, {start: recommend_start_loc}, {end: recommend_end_loc})
		util.setEntities({
	      key: 'order_info',
	      value: parmas
	    })
	    wx.navigateTo({
	      url: `/src/submitorder/submitorder?bookSeats=${parmas.bookSeats}&price=${parmas.price}&sharePhone=${parmas.sharePhone}&travelId=${parmas.travelId}&share_type=other`
	    })
  },
  grabAsingLe: function(){
	const { travelInfo, options } = this.data
	let userInfo = wx.getStorageSync('first_userInfo')
	if(!userInfo.phone){
		wx.navigateTo({
			url: `/src/login/login`
		})
		return
	}
	wx.showModal({
		title: '提示',
		content: '抢单需接送乘客',
		success: function(res) {
			if (res.confirm) {
			driver_api.driverGrabAsingle({
				data:{
					token: userInfo.token,
					passengerTravelId: travelInfo.travelId,
					sharePhone: options.phone
				}
			}).then(json => {
					if(json.data.status === -1){
						wx.showModal({
							title: '提示',
							content: '您还未登录，登录之后再来抢单~',
							confirmText: '去认证',
							success: function(res) {
							if (res.confirm) {
									wx.navigateTo({
										url: `/src/login/login`
									})
								}
							}
						})
						return
					}
          if(json.data.status === -361){
            wx.showModal({
              title: '提示',
              content: '您还在认证中,不能抢单',
              showCancel: false
            })
            return
          }
					if(json.data.status === -5){
						wx.showModal({
							title: '提示',
							content: '您还未进行车主认证，请认证为车主之后再来哦~',
							confirmText: '去认证',
							success: function(res) {
								if (res.confirm) {
									wx.navigateTo({
										url: `/src/ownersCertification/ownersCertification`
									})
								}
							}
						})
						return
					}

					if(json.data.status !== -353){
						wx.showModal({
							title: '提示',
							content: json.data.detail,
							confirmText: '确定',
							showCancel: false
						})
					}else{
						wx.showModal({
							title: '提示',
							content: json.data.detail + ', 请前往趣出行查看',
							confirmText: '知道了',
							success: function(res) {
								if (res.confirm) {
									wx.switchTab({
										url: `/src/travelList/travelList`
									})
								}
							}
						})
					}
				})
			} else if (res.cancel) {
				console.log('用户点击取消')
			}
		}
	})
  },
  gotoApp: function(){
  	util.gotoApp()
  },
  addMarkes: function(data, type){
    const { recommend_start_loc, recommend_end_loc } = this.data
    let markers = type == 1 ? [{
      iconPath: '../../images/icon_map_star@3x_two.png',
      id: 0,
      latitude: data.start[1],
      longitude: data.start[0],
      width: 32,
      height: 47
    },{
      iconPath: '../../images/icon_map_end@3x_two.png',
      id: 1,
      latitude: data.end[1],
      longitude: data.end[0],
      width: 32,
      height: 47
    }] : [{
      iconPath: '../../images/icon_map_star@3x_two.png',
      id: 0,
      latitude: data.start[1],
      longitude: data.start[0],
      width: 32,
      height: 47
    },{
      iconPath: '../../images/icon_map_end@3x_two.png',
      id: 1,
      latitude: data.end[1],
      longitude: data.end[0],
      width: 32,
      height: 47
    },{
      iconPath: '../../images/icon_map_scd@3x.png',
      id: 2,
      latitude: recommend_start_loc[1],
      longitude: recommend_start_loc[0],
      width: 20,
      height: 20
    },{
      iconPath: '../../images/icon_map_xcd@3x.png',
      id: 3,
      latitude: recommend_end_loc[1],
      longitude: recommend_end_loc[0],
      width: 20,
      height: 20
    }]
    this.setData({
        markers: markers
    })
    wx.hideLoading()
  },
  _cancelEvent(){
    this.authorized = this.selectComponent("#authorized");
    this.authorized.hideDialog()
    this.initData(null, 'noAuthorized')
  }
})
