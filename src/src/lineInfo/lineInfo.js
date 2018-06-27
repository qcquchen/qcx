import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
var app = getApp()

Page({
  data: {
    code_type: 0,
    switch_date: [],
    date_type: moment().format('dddd'),
    date_pattern_type: moment().toDate().pattern('yyyy-MM-dd'),
    start_date: moment().toDate().pattern('yyyy-MM-dd'),
    lineInfo: {},
    dateTravel: [],
    page: 1,
    end_date: moment().add(2, 'years').toDate().pattern('yyyy-MM-dd'),
    img_width: wx.getSystemInfoSync().windowWidth,
    cityIndex: 0,
    city: '',
    isAuthorized: false
  },
  onShow(){
    // const { options } = this.data
    // this.initData(options)
    // util.setEntities({
    //   key: 'callback',
    //   value: this.initData
    // })
    let self = this
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
  },
  onLoad(option){
    let ops = option.scene ? decodeURIComponent(option.scene).split(',') : option
    if(option.scene){
      option.groupId = ops[0]
      option.groupType = ops[1]
    }
    this.setData({
      options: option
    })
  },
  initData(){
    let self = this
    let option = this.data.options
    const { date_pattern_type, code_type, page } = this.data
    const { token } = app.globalData.entities.loginInfo
    this.switch_date_factory()
    util.loactionAddress().then(res => {
      self.setData({
        groupType: Number(option.groupType),
        city: res.initial_city
      })
      switch (Number(option.groupType))
      {
        case 0:
          this.groupDetail(option.groupId, date_pattern_type, code_type, token)
          break;
        case 1:
          this.touristGroupDetail(option.groupId, date_pattern_type, code_type, res.initial_city, token, page)
          break;
        case 2:
          this.crossCityGroupDetail(option.groupId, date_pattern_type, code_type, 0, token, page)
          break;
      }
    })
  },
  groupDetail: function(id, dateType, codeType, token){
    let parmas = Object.assign({}, {token: token}, {groupId: id}, {travelType: codeType}, {dateOfTxt: dateType})
    driver_api.groupDetail({data: parmas}).then(json => {
      let data = json.data
      let thatDayTravels = data.thatDayTravels
      let dateTravel =  util.ObjectArray(thatDayTravels)
      dateTravel && dateTravel.map(json => {
        json && json.time_line.map(res => {
          res.startTime = moment(res.startTime).toDate().pattern('HH:mm')
        })
      })
      switch (data.groupType) {
        case 0:
          data.groupTypeTxt = '上下班'
          break;
        case 1:
          data.groupTypeTxt = '景点'
          break;
        case 2:
          data.groupTypeTxt = '跨城'
          break;
        default:
          break;
      }
      this.setData({
        lineInfo: data,
        dateTravel: dateTravel
      })
      this.getLine(data.start, data.end)
    })
  },
  crossCityGroupDetail: function(id, dateType, codeType, goOrCome, token, page){
    const { dateTravel } = this.data
    let parmas = Object.assign({}, {token: token}, {groupId: id}, {travelType: codeType}, {startDateOfTxt: dateType}, {goOrCome: goOrCome}, {pageNo: page})
    driver_api.crossCityGroupDetail({data: parmas}).then(json => {
      let data = json.data
      let thatDayTravels = data.travelOneVos
      thatDayTravels && thatDayTravels.map(json => {
        if(json.travelVo.surplusSeats != 0){
          let seat_true = util.seats_true(json.travelVo.seats - json.travelVo.surplusSeats)
          let seat_false = util.seats_false(json.travelVo.surplusSeats)
          json.travelVo.seat_true = seat_true
          json.travelVo.seat_false = seat_false
        }else{
          let seat_true = util.seats_true(json.travelVo.seats)
          json.travelVo.seat_true = seat_true
        }
        dateTravel.push(json)
      })
      switch (data.groupType) {
        case 0:
          data.groupTypeTxt = '上下班'
          break;
        case 1:
          data.groupTypeTxt = '景点'
          break;
        case 2:
          data.groupTypeTxt = '跨城'
          break;
        default:
          break;
      }
      util.arrayUnqueInfo(dateTravel).then(res => {
        this.setData({
          lineInfo: data,
          dateTravel: res,
          bottom_line: thatDayTravels.length != 0 ? true : false
        })
      })
      this.getLine(data.start, data.end)
    })
  },
  touristGroupDetail: function(id, dateType, codeType, city, token, page){
    const { dateTravel } = this.data
    let parmas = Object.assign({}, {token: token}, {groupId: id}, {travelType: codeType}, {startDateOfTxt: dateType}, {currentCity: city}, {pageNo: page})
    let currentCity = this.data.city
    driver_api.touristGroupDetail({data: parmas}).then(json => {
      let data = json.data
      let thatDayTravels = data.travelOneVos
      thatDayTravels && thatDayTravels.map(json => {
        if(json.travelVo.surplusSeats != 0){
          let seat_true = util.seats_true(json.travelVo.seats - json.travelVo.surplusSeats)
          let seat_false = util.seats_false(json.travelVo.surplusSeats)
          json.travelVo.seat_true = seat_true
          json.travelVo.seat_false = seat_false
        }else{
          let seat_true = util.seats_true(json.travelVo.seats)
          json.travelVo.seat_true = seat_true
        }
        dateTravel.push(json)
      })
      switch (data.groupType) {
        case 0:
          data.groupTypeTxt = '上下班'
          break;
        case 1:
          data.groupTypeTxt = '景点'
          break;
        case 2:
          data.groupTypeTxt = '跨城'
          break;
        default:
          break;
      }
      let nowCity = []
      data.citys.splice(0, 0, currentCity)
      data && data.citys.map((json, index) => {
        if(data.citys[index] == currentCity){
          nowCity.push(index)
        }
      })
      data.citys.splice(nowCity[1], 1)
      util.arrayUnqueInfo(dateTravel).then(res => {
        this.setData({
          lineInfo: data,
          dateTravel: res,
          bottom_line: thatDayTravels.length != 0 ? true : false
        })
      })
    })
  },
  switch_code: function(e){
      const { currentTarget: { dataset: { id } } } = e
      const { date_pattern_type, lineInfo, groupType, page, city, code_type, cityIndex } = this.data
      const { token } = app.globalData.entities.loginInfo
      this.setData({
        code_type: id,
        dateTravel: []
      })
      let new_page = code_type != id ? 1 : page
      let nowCity = lineInfo.citys && lineInfo.citys.length != 0 ? lineInfo.citys[cityIndex] : city
      switch (groupType)
      {
        case 0:
          this.groupDetail(lineInfo.groupId, date_pattern_type, id, token)
          break;
        case 1:
          this.touristGroupDetail(lineInfo.groupId, date_pattern_type, id, nowCity, token, new_page)
          break;
        case 2:
          this.crossCityGroupDetail(lineInfo.groupId, date_pattern_type, id, 0, token, new_page)
          break;
      }
  },
  switch_date_factory: function(){
    let week_arr = util.switch_date()
    week_arr.map((json, index) => {
      if(index === 0) json.week_txt = '今天'
      if(index === 1) json.week_txt = '明天'
      if(index === 2) json.week_txt = '后天'
    })
    this.setData({
      switch_date: week_arr
    })
  },
  clickDate: function(e){
    const { currentTarget: { dataset: { type } } } = e
    const { code_type, lineInfo } = this.data
    const { token } = app.globalData.entities.loginInfo
    this.setData({
      date_pattern_type: type
    })
    this.groupDetail(lineInfo.groupId, type, code_type, token)
  },
  getLine: function(start, end){
    const { lineInfo } = this.data
    const { token } = app.globalData.entities.loginInfo
    driver_api.getLineV1({
      data: {
        token: token,
        start: start,
        end: end,
        strategy: 0
      }
    }).then(json => {
      const { route } = json.data.routes
      if(!route){
        return
      }
      this.setData({
        markers: [{
          iconPath: '../../images/icon_map_star@3x_two.png',
          id: 0,
          longitude: start[0],
          latitude: start[1],
          width: 32,
          height: 40
        },{
          iconPath: '../../images/icon_map_end@3x_two.png',
          id: 1,
          longitude: end[0],
          latitude: end[1],
          width: 32,
          height: 40
        }],
        polyline: [{
          points: route,
          color:"#499EFF",
          width: 10,
          dottedLine: false,
          arrowLine: true,
          borderColor: '#4494F0',
          borderWidth: 1
        }],
        route: route
      })
    })
  },
  joined: function(e){
    const { lineInfo, date_pattern_type, code_type, groupType, page, cityIndex, city } = this.data
    const { token, phone } = app.globalData.entities.loginInfo
    let parmas = Object.assign({}, {token: token}, {phones: phone}, { groupId: [lineInfo.groupId] })
    let nowCity = lineInfo.citys && lineInfo.citys.length != 0 ? lineInfo.citys[cityIndex] : city
    if(lineInfo.isJoined) {
      driver_api.leaveGroup({
        data: parmas
      }).then(json => {
        if(json.data.status == 200){
          wx.showToast({
            title: '已退出',
            icon: 'success',
            duration: 2000
          })
          switch (groupType)
          {
            case 0:
              this.groupDetail(lineInfo.groupId, date_pattern_type, code_type, token)
              break;
            case 1:
              this.touristGroupDetail(lineInfo.groupId, date_pattern_type, code_type, nowCity, token, page)
              break;
            case 2:
              this.crossCityGroupDetail(lineInfo.groupId, date_pattern_type, code_type, 0, token, page)
              break;
          }
        }
      })
    }else{
      driver_api.postJoinGroup({data: parmas}).then(json => {
        if(json.data.status == 200){
          wx.showToast({
            title: '已加入',
            icon: 'success',
            duration: 2000
          })
          switch (groupType)
          {
            case 0:
              this.groupDetail(lineInfo.groupId, date_pattern_type, code_type, token)
              break;
            case 1:
              this.touristGroupDetail(lineInfo.groupId, date_pattern_type, code_type, nowCity, token, page)
              break;
            case 2:
              this.crossCityGroupDetail(lineInfo.groupId, date_pattern_type, code_type, 0, token, page)
              break;
          }
        }
      })
    }
  },
  gotoIndex: function(){
    wx.switchTab({
      url: `/src/index`
    })
  },
  gotoTravelInfo: function(e){
    const { currentTarget: { dataset: { id } } } = e
    const { phone } = app.globalData.entities.loginInfo
    const { code_type } = this.data
    wx.navigateTo({
      url: `/src/travelInfo/travelInfo?travelId=${id}&travelType=${code_type}&phone=${phone}`
    })
  },
  gotoGroupList: function(){
    const { lineInfo } = this.data
    wx.navigateTo({
      url: `/src/groupList/groupList?groupId=${lineInfo.groupId}`
    })
  },
  bindDateChange: function(e) {
    const { lineInfo, groupType, code_type, cityIndex, city } = this.data
    const { token } = app.globalData.entities.loginInfo
    let date = e.detail.value
    let nowCity = lineInfo.citys && lineInfo.citys.length != 0 ? lineInfo.citys[cityIndex] : city
    this.setData({
      date_pattern_type: e.detail.value,
      dateTravel: []
    })
    switch (groupType)
    {
      case 1:
        this.touristGroupDetail(lineInfo.groupId, e.detail.value, code_type, nowCity, token, 1)
        break;
      case 2:
        this.crossCityGroupDetail(lineInfo.groupId, e.detail.value, code_type, 0, token, 1)
        break;
    }
  },
  bindPickerChange: function (e) {
    const { lineInfo, groupType, date_pattern_type, code_type, city } = this.data
    const { token } = app.globalData.entities.loginInfo
    let nowCity = lineInfo.citys && lineInfo.citys.length != 0 ? lineInfo.citys[e.detail.value] : city
    this.setData({
      cityIndex: e.detail.value,
      dateTravel: []
    })
    this.touristGroupDetail(lineInfo.groupId, date_pattern_type, code_type, nowCity, token, 1)
  },
  gotoTravelShare: function(e){
    const { currentTarget: { dataset: { id, type } } } = e
    const { phone } = app.globalData.entities.loginInfo
    wx.navigateTo({
      url: `/src/travelInfo/travelInfo?travelId=${id}&travelType=${type}&phone=${phone}`
    })
  },
  postLike: function(e){
    const { token } = app.globalData.entities.loginInfo
    const { currentTarget: { dataset: { id } } } = e
    const { dateTravel } = this.data
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
        dateTravel.map(json => {
          if(json.travelVo.travelId == id){
            json.travelVo.liked = !json.travelVo.liked
            json.travelVo.likesNum = json.travelVo.likesNum + 1
          }
        })
        this.setData({
          dateTravel: dateTravel
        })
      }
    })
  },
  travelUnlike: function(e){
    const { token } = app.globalData.entities.loginInfo
    const { currentTarget: { dataset: { id } } } = e
    const { dateTravel } = this.data
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
        dateTravel.map(json => {
          if(json.travelVo.travelId == id){
            json.travelVo.liked = !json.travelVo.liked
            json.travelVo.likesNum = json.travelVo.likesNum - 1
          }
        })
        this.setData({
          dateTravel: dateTravel
        })
      }
    })
  },
  onReachBottom: function(){
    const { token } = app.globalData.entities.loginInfo
    const { bottom_line, groupType, lineInfo, date_pattern_type, code_type, page, cityIndex, city } = this.data
    let nowCity = lineInfo.citys &&  lineInfo.citys.length != 0 ? lineInfo.citys[cityIndex] : city
    if(bottom_line){
      let new_page = page + 1
      this.setData({
        page: new_page
      })
      switch (groupType)
      {
        case 1:
          this.touristGroupDetail(lineInfo.groupId, date_pattern_type, code_type, nowCity, token, new_page)
          break;
        case 2:
          this.crossCityGroupDetail(lineInfo.groupId, date_pattern_type, code_type, 0, token, new_page)
          break;
      }
    }
  },
  submit: function(e){
    const { dateTravel, options } = this.data
    const { currentTarget: { dataset: { id } } } = e
    let travel = dateTravel.find(json => json.travelVo.travelId == id).travelVo
    if(travel.surplusSeats == 0){
      wx.showModal({
        title: '提示',
        content: '暂无余座',
        showCancel: false
      })
      return
    }
    let parmas = Object.assign({}, {bookSeats: travel.surplusSeats}, {travelId: travel.travelId}, { price: travel.travelPrice }, { sharePhone: '' })
    util.setEntities({
        key: 'order_info',
        value: parmas
      })
      wx.navigateTo({
        url: `/src/submitorder/submitorder?bookSeats=${parmas.bookSeats}&price=${parmas.price}&travelId=${parmas.travelId}&sharePhone=${parmas.sharePhone}`
      })
  },
  grabAsingLe: function(e){
    const { dateTravel } = this.data
    const { currentTarget: { dataset: { id } } } = e
    let travel = dateTravel.find(json => json.travelVo.travelId == id).travelVo
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
                passengerTravelId: travel.travelId
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
                  showCancel: false
                })
              }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // console.log(res.target)
    }
    const { options, lineInfo } = this.data
    return {
      title: lineInfo.groupTitle,
      path: `/src/lineInfo/lineInfo?groupId=${options.groupId}&groupType=${options.groupType}`,
      imageUrl: 'https://v1.driver.quchuxing.com.cn/resources/pictures/img_share_weixinhaoyou.png',
      success: function(res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '转发失败',
          icon: 'success',
          duration: 2000
        })
      }
    }
  },
  _cancelEvent(){
    this.authorized = this.selectComponent("#authorized");
    this.authorized.hideDialog()
    this.initData(null, 'noAuthorized')
  }
})
