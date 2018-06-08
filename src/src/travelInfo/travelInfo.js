import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
import { GAODESDK } from '../../js/constants'
var app = getApp()

Page({
  data: {
    window: {},
    switch_type: 'siteRide',
    latitude: 23.099994,
    longitude: 113.324520,
    travelInfo: {},
    polyline: [],
    markers: [],
    history: true,
    updateType: true,
    myAddress: '正在获取当前位置',
    history_L: [],
    inputLineType: true,
    myEndAddress: ''
  },
  onLoad(options){
    wx.showLoading({
      title: '加载中',
    })
    let ops = options.scene ? decodeURIComponent(options.scene).split(',') : options
    this.setData({
      options: ops,
      window: wx.getSystemInfoSync()
    })
  },
  onShow(){
    const { options, updateType } = this.data
    const { appLaunch } = app.globalData
    if(options.scene){
        ops.travelId = ops[0]
        ops.phone = ops[1]
        ops.travelType = ops[2]
    }
    if(appLaunch){
      if(updateType){
        this.initData(null, 'authorized')
      }
    }else{
      app.getWechatInfo().then(() => {
        this.initData(null, 'authorized')
      })
    }
  },
  initData(){
    const { options } = this.data
    util.loactionAddress().then(res => {
      this.setData({
        myLoc: res,
        isAuthorized: false,
        myAddress: res.startAddress,
        myLocation: res.startLocation,
        history_L: wx.getStorageSync('historyLine').length !== 0 ? wx.getStorageSync('historyLine') : []
      })
      this.getTravelDetail(options.travelId, options.travelType, options.start, options.end, options.start_addr, options.end_addr)
    })
  },
  clickSwitchCode: function(e){
    const { travelInfo, options } = this.data
    const { currentTarget: { dataset: { id } } } = e
    this.setData({
      switch_type: id
    })
    this.planningRoutes()
    this.addMarkes(travelInfo, options.travelType)
  },
  getTravelDetail: function(id, type, start, end, start_addr, end_addr){
    const { options } = this.data
    const { token } = app.globalData.entities.loginInfo
    const { myLoc } = this.data
    driver_api.getTravelDetail({
      data: {
        token: token,
        travelId: id,
        type: type,
        start: start,
        end: end
      }
    }).then(json => {
      let data = json.data.travelDetail
      data.mineEnd = end || data.matchEnd
      data.mineStart = start || data.matchStart
      data.mineEndAddress = end_addr || data.matchEndAddress
      data.mineStartAddress = start_addr || data.matchStartAddress
      data.endTime = moment(data.recommendEndTime).toDate().pattern('HH:mm')
      data.startTime = moment(data.recommendStartTime).toDate().pattern('HH:mm')
      data.recommendStartTimeText = moment(data.recommendStartTime).toDate().pattern('yyyy-MM-dd HH:mm:ss')
      data.pickUpStartTimeText = moment(data.pickUpStartTime).toDate().pattern('yyyy-MM-dd HH:mm:ss')
      if(type == 0){
        if(data.surplusSeats != 0){
            let seat_true = util.seats_true(data.seats - data.surplusSeats)
            let seat_false = util.seats_false(data.surplusSeats)
            data.seat_true = seat_true
            data.seat_false = seat_false
        }else{
            let seat_true = util.seats_true(data.seats)
            data.seat_true = seat_true
            data.seat_false = []
        }
        data.passengers && data.passengers.map((json, index) => {
          if(json.bookSeats > 1){
            for(let i = 0; i <= json.bookSeats; i++){
              data.passengers.push(data.passengers[index])
            }
          }
        })
        data && data.seat_false.map((json, index) => {
          json.img = '../../images/img_haveseat@3x.png'
        })
        data.seat_true && data.seat_true.map((json_img, index_one) => {
          json_img.img = data.passengers[index_one].picture
        })
      }
      this.setData({
        travelInfo: data,
        attention: data.attention
      })
      this.planningRoutes()
      this.addMarkes(data, type)
      if(data.recommendStatus) {
        if(type == 0){
          this.walk_startDis(data.mineStart, data.recommendStartLocation)
        }else{
          this.starting_distance(data.mineStart, data.start)
        }
      }
      this.getSearchAddress()
      wx.hideLoading()
    })
  },
  addMarkes: function(data, type){
    const { switch_type } = this.data
    let start = typeof(data.start) == 'string' ? data.start.split(',') : data.start
    let end = typeof(data.end) == 'string' ? data.end.split(',') : data.end
    let matchStart = typeof(data.recommendStartLocation) == 'string' ? data.recommendStartLocation.split(',') : data.recommendStartLocation
    let matchEnd = typeof(data.recommendEndLocation) == 'string' ? data.recommendEndLocation.split(',') : data.recommendEndLocation
    // if(data.recommendStatus){
    //   start = typeof(data.start) == 'string' ? data.start.split(',') : data.start
    //   end = typeof(data.end) == 'string' ? data.end.split(',') : data.end
    // }else{
    //   start = typeof(data.mineStart) == 'string' ? data.mineStart.split(',') : data.mineStart
    //   end = typeof(data.mineEnd) == 'string' ? data.mineEnd.split(',') : data.mineEnd
    // }
    let markers = []
    if(type == 1){
      markers = [{
        iconPath: '../../images/icon_map_star@3x_two.png',
        id: 0,
        latitude: start[1],
        longitude: start[0],
        width: 32,
        height: 47
      },{
        iconPath: '../../images/icon_map_end@3x_two.png',
        id: 1,
        latitude: end[1],
        longitude: end[0],
        width: 32,
        height: 47
      }]
    }else if(type == 0){
      if(switch_type == 'siteRide'){
        markers = [{
          iconPath: '../../images/icon_map_star@3x_two.png',
          id: 0,
          latitude: start[1],
          longitude: start[0],
          width: 32,
          height: 47
        },{
          iconPath: '../../images/icon_map_end@3x_two.png',
          id: 1,
          latitude: end[1],
          longitude: end[0],
          width: 32,
          height: 47
        },{
          iconPath: '../../images/icon_map_scd@3x.png',
          id: 2,
          latitude: data.recommendStatus ? matchStart[1] : 0,
          longitude: data.recommendStatus ? matchStart[0] : 0,
          width: 20,
          height: 20
        },{
          iconPath: '../../images/icon_map_xcd@3x.png',
          id: 3,
          latitude: data.recommendStatus ? matchEnd[1] : 0,
          longitude: data.recommendStatus ? matchEnd[0] : 0,
          width: 20,
          height: 20
        }]
      }else{
        start = typeof(data.mineStart) == 'string' ? data.mineStart.split(',') : data.mineStart
        end = typeof(data.mineEnd) == 'string' ? data.mineEnd.split(',') : data.mineEnd
        markers = [{
          iconPath: '../../images/icon_map_star@3x_two.png',
          id: 0,
          latitude: start[1],
          longitude: start[0],
          width: 32,
          height: 47
        },{
          iconPath: '../../images/icon_map_end@3x_two.png',
          id: 1,
          latitude: end[1],
          longitude: end[0],
          width: 32,
          height: 47
        }]
      }
    }

    this.setData({
        markers: markers
    })
  },
  planningRoutes: function(){
    const { travelInfo, switch_type } = this.data
    let parmas = {}
    if(switch_type == 'siteRide'){
      parmas = Object.assign({}, {start: travelInfo.start}, {end: travelInfo.end}, {waypoints: travelInfo.waypoints})
    }else{
      parmas = Object.assign({}, {start: travelInfo.mineStart}, {end: travelInfo.mineEnd})
    }
    let start = ''
    if(travelInfo.recommendStatus){
      start = typeof(travelInfo.mineStart) == 'string' ? travelInfo.mineStart.split(',') : travelInfo.mineStart
    }else{
      start = typeof(travelInfo.start) == 'string' ? travelInfo.start.split(',') : travelInfo.start
    }
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
        longitude: start[0],
        latitude: start[1]
      })
    })
  },
  walk_startDis: function(start, end){
    const { travelInfo } = this.data
    util.getWalkingRoute(start, end).then(res　=> {
      this.setData({
        gotoStart: res
      })
      this.walk_endDis(travelInfo.recommendEndLocation)
    })
  },
  walk_endDis: function(start){
    const { travelInfo } = this.data
    util.getWalkingRoute(start, travelInfo.mineEnd).then(res　=> {
      this.setData({
        gotoEnd: res
      })
    })
  },
  starting_distance: function(start, end){
    const { travelInfo } = this.data
    util.getDrivingRoute(start, end).then(res => {
      this.setData({
        gotoStart: res
      })
      this.end_distance(travelInfo.end)
    })
  },
  end_distance: function(start){
    const { travelInfo } = this.data
    util.getDrivingRoute(start, travelInfo.mineEnd).then(res => {
      this.setData({
        gotoEnd: res
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
  updateAddress: function(e){
    const { currentTarget: { dataset: { id } } } = e
    const { options, travelInfo, myLocation, myAddress } = this.data
    let loc = []
    let self = this
    wx.getSetting({
      success: function(res){
        if(res.authSetting['scope.userLocation']){
          wx.chooseLocation({
            success(res){
              loc.push(res.longitude)
              loc.push(res.latitude)
              if(id === 'start'){
                self.getTravelDetail(options.travelId, options.travelType, loc, travelInfo.mineEnd, res.name, travelInfo.mineEndAddress)
              }else if(id === 'end'){
                self.getTravelDetail(options.travelId, options.travelType, travelInfo.mineStart, loc, travelInfo.mineStartAddress, res.name)
              }else if(id === 'resStart'){
                travelInfo.recommendStartAddress = res.name
                self.setData({travelInfo: travelInfo})
                self.walk_startDis(travelInfo.mineStart, loc)
              }else if(id === 'resEnd'){
                travelInfo.recommendEndAddress = res.name
                self.setData({travelInfo: travelInfo})
                self.walk_endDis(loc)
              }else if(id === 'carStart'){
                travelInfo.mineStart = loc
                travelInfo.mineStartAddress = res.name
                self.setData({travelInfo: travelInfo})
              }else if(id === 'carEnd'){
                let start = travelInfo.mineStart == null ? myLocation : travelInfo.mineStart
                let startAddr = travelInfo.mineStartAddress == null ? myAddress : travelInfo.mineStartAddress
                self.getTravelDetail(options.travelId, options.travelType, start, loc, startAddr, res.name)
              }
            }
          })
          self.setData({
            updateType: false
          })
        }
      }
    })
  },
  bookNow: function(){
    const { travelInfo, options, switch_type} = this.data
    let userInfo = wx.getStorageSync('first_userInfo')
    if(!userInfo.phone){
      wx.navigateTo({
        url: `/src/login/login`
      })
      return
    }
    if(travelInfo.surplusSeats == 0){
      wx.showModal({
      title: '提示',
      content: '暂无余座',
      showCancel: false
    })
      return
    }
    let createTime = switch_type == 'siteRide' ? travelInfo.recommendStartTime : travelInfo.pickUpStartTime
    let start = switch_type == 'siteRide' ? travelInfo.recommendStartLocation : travelInfo.mineStart
    let startAddr = switch_type == 'siteRide' ? travelInfo.recommendStartAddress : travelInfo.mineStartAddress
    let end = switch_type == 'siteRide' ? travelInfo.recommendEndLocation : travelInfo.mineEnd
    let endAddr = switch_type == 'siteRide' ? travelInfo.recommendEndAddress : travelInfo.mineEndAddress
    let isPickUp = switch_type == 'siteRide' ? false : true
    let startTime = switch_type == 'siteRide' ? travelInfo.recommendStartTimeText : travelInfo.pickUpStartTimeText

    let parmas = Object.assign({}, {bookSeats: travelInfo.surplusSeats}, {travelId: options.travelId}, { price: travelInfo.travelPrice }, { sharePhone: options.phone }, {startAddress: startAddr}, {endAddress: endAddr}, {start: start}, {end: end}, {createTime: createTime}, {isPickUp: isPickUp}, {extraDistance: travelInfo.extraDistance}, {extraMoney: travelInfo.extraMoney}, {startTime: startTime})
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
            passengerTravelId: options.travelId,
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
  redirection: function(){
    const { travelInfo } = this.data
    let start = typeof(travelInfo.mineStart) == 'string' ? travelInfo.mineStart.split(',') : travelInfo.mineStart
    this.setData({
      longitude: start[0],
      latitude: start[1]
    })
  },
  gotoInputLine: function(){
    const { inputLineType } = this.data
    this.setData({
      inputLineType: !inputLineType,
      history: true
    })
  },
  getSearchAddress: function(){
    const { token } = app.globalData.entities.loginInfo
    if(!token){
      this.setData({
        commonlyUsed: true
      })
      return
    }
    driver_api.getSearchAddress({
      data: {
        token: token
      }
    }).then(json => {
      if(json.data.status == 200){
        this.setData({
          commonlyUsed: false,
          commonlyUsedAddr: json.data.result
        })
      }
    })
  },
  clickCommonly: function(e){
    const { commonlyUsed, inputStatus, options, commonlyUsedAddr, myAddress, myLocation, inputLineType } = this.data
    const { currentTarget: { dataset: { type } } } = e
    let userInfo = wx.getStorageSync('first_userInfo')
    if(!userInfo.phone){
      wx.navigateTo({
        url: `/src/login/login`
      })
      return
    }
    if(commonlyUsed){
      wx.navigateTo({
        url: `/src/login/setLocation`
      })
      return
    }
    let address = type == '0' ? commonlyUsedAddr.addr_home : commonlyUsedAddr.addr_company
    let location = type == '0' ? commonlyUsedAddr.location_home : commonlyUsedAddr.location_company
    if(inputStatus == 'start'){
      this.setData({
        myAddress: address,
        myLocation: location
      })
    }else{
      this.setData({
        myEndAddress: address,
        myEndLocation: location,
        inputLineType: !inputLineType
      })
      this.getTravelDetail(options.travelId, options.travelType, myLocation, location, myAddress, address)
    }
  },
  selectHistory: function(e){
    const { history_L, travelInfo, options, inputLineType } = this.data
    const { currentTarget: { dataset: { id } } } = e
    let data = history_L.find((json, index) => index == id)
    this.getTravelDetail(options.travelId, options.travelType, data.start_loc, data.end_loc, data.start_addr, data.end_addr)
    this.setData({
      inputLineType: !inputLineType
    })
  },
  bindfocus: function(e){
    const { currentTarget: { dataset: { type } } } = e
    this.setData({
      inputStatus: type
    })
  },
  enterAddr: function(e){
    let self = this
    let keys = e.detail.value
    GAODESDK.getInputtips({
      keywords: keys,
      success: function(res){
        if(res && res.tips){
          self.setData({
            tips: res.tips,
            history: false
          })
        }
      }
    })
  },
  setAddress: function(e){
    const { currentTarget: { dataset: { id } } } = e
    const { tips, inputStatus, inputLineType, myAddress, myLocation, myEndAddress, myEndLocation, options } = this.data
    let data = tips.find((json, index) => index == id)
    data.location = data.location.split(',')
    inputStatus == 'start' ? this.setData({
      myAddress: data.name,
      myLocation: data.location
    }) : this.setData({
      myEndAddress: data.name,
      myEndLocation: data.location,
      inputLineType: !inputLineType
    })
    if(inputStatus != 'start'){
      this.getTravelDetail(options.travelId, options.travelType, myLocation, data.location, myAddress, data.name)
    }
  },
  pullAttention: function(){
    const { travelInfo, attention } = this.data
    const { token } = app.globalData.entities.loginInfo
    let userInfo = wx.getStorageSync('first_userInfo')
    if(!userInfo.phone){
      wx.navigateTo({
        url: `/src/login/login`
      })
      return
    }
    driver_api.pullAttention({
      data: {
        token: token,
        attentionPhone: travelInfo.phone
      }
    }).then(json => {
      if(json.data.status == 200){
        this.setData({
          attention: !attention
        })
      }
    })
  },
  postAttention: function(){
    const { travelInfo, attention } = this.data
    const { token } = app.globalData.entities.loginInfo
    let userInfo = wx.getStorageSync('first_userInfo')
    if(!userInfo.phone){
      wx.navigateTo({
        url: `/src/login/login`
      })
      return
    }
    driver_api.postAttention({
      data: {
        token: token,
        attentione: travelInfo.phone
      }
    }).then(json => {
      if(json.data.status == 200){
        this.setData({
          attention: !attention
        })
      }
    })
  },
  navAddress: function(e){
    const { currentTarget: { dataset: { id } } } = e
    const { travelInfo } = this.data
    let latitude = 0
    let longitude = 0
    let address = ''
    if(id == 'up'){
      latitude = travelInfo.start[1]
      longitude = travelInfo.start[0]
      address = travelInfo.startAddress
    }else if(id == 'down'){
      latitude = travelInfo.end[1]
      longitude = travelInfo.end[0]
      address = travelInfo.endAddress
    }else if(id == 'walkUp'){
      latitude = travelInfo.recommendStartLocation[1]
      longitude = travelInfo.recommendStartLocation[0]
      address = travelInfo.recommendStartAddress
    }else if(id == 'walkDown'){
      latitude = travelInfo.recommendEndLocation[1]
      longitude = travelInfo.recommendEndLocation[0]
      address = travelInfo.recommendEndAddress
    }
    wx.getSetting({
      success: function(res){
        if(res.authSetting['scope.userLocation']){
          wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            address: address,
            scale: 28
          })
        }
      }
    })
  }
})
