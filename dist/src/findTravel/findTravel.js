import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
import { WATER_BILL_TYPE } from '../../js/constants'
var app = getApp()

Page({
  data: {
    myGroup: [],
    isRecommend: true,
    hotGroups: [],
    page: 1,
    loadingTxt: '加载中...',
    isAuthorized: false
  },
  onShow(){
    let self = this
    const { appLaunch } = app.globalData
    if(appLaunch){
      const { token } = app.globalData.entities.loginInfo
      self.getLocationCity(token, 'authorized')
    }else{
      app.getWechatInfo().then(() => {
        wx.showLoading({
          title: '加载中',
        })
        const { token } = app.globalData.entities.loginInfo
        self.getLocationCity(token, 'authorized')
      })
    }
  },
  getLocationCity: function(token, type){
    let page = this.data.page
    util.loactionAddress().then(res => {
      if(type == 'authorized'){
        this.myJoinedGroups(token, res.initial_city)
      }
      this.hotGroups(token, res.initial_city, page)
      this.setData({
        city: res.initial_city,
        isAuthorized: false
      })
    })
  },
  myJoinedGroups: function(token, city){
    let parmas = Object.assign({}, {token: token}, {currentCity: city}, {pageNo: 1})
    driver_api.myJoinedGroups({data: parmas}).then(json => {
      let data = json.data.myJoinedGroups
      data && data.groupsList.map(json => {
        switch (json.groupType) {
          case 0:
            json.groupTypeTxt = '上下班'
            break;
          case 1:
            json.groupTypeTxt = '景点'
            break;
          case 2:
            json.groupTypeTxt = '跨城'
            break;
          default:
            break;
        }
      })
      this.setData({
        isRecommend: data.isRecommend,
        myGroup: data.groupsList
      })
    })
  },
  hotGroups: function(token, city){
    const { page } = this.data
    let parmas = Object.assign({}, {token: token}, {currentCity: city}, {pageNo: page})
    const { hotGroups } = this.data
    driver_api.hotGroups({data: parmas}).then(json => {
      let data = json.data.hotGroups
      data && data.map(json => {
        switch (json.groupType) {
          case 0:
            json.groupTypeTxt = '上下班'
            break;
          case 1:
            json.groupTypeTxt = '景点'
            break;
          case 2:
            json.groupTypeTxt = '跨城'
            break;
          default:
            break;
        }
        hotGroups.push(json)
      })
      util.arrayUnque(hotGroups).then(res => {
        this.setData({
          hotGroups: res,
          bottom_line: data.length != 0 ? true : false,
          loadingTxt: res.length == 0 ? '暂无拼车群' : '加载中'
        })
        wx.hideLoading()
      })
    })
  },
  joinGroup: function(e){
    const { currentTarget: { dataset: { id } } } = e
    const { token, phone } = app.globalData.entities.loginInfo
    const { city, hotGroups } = this.data
    let parmas = Object.assign({}, {token: token}, {phones: phone}, { groupId: [id] })
    driver_api.postJoinGroup({data: parmas}).then(json => {
      if(json.data.status == 200){
        wx.showToast({
          title: '已加入',
          icon: 'success',
          duration: 2000
        })
        hotGroups.map((json, index) => {
          if(json.groupId == id){
            json.isJoined = true
            hotGroups.splice(index, 1);
          }
        })
        this.setData({
          hotGroups: hotGroups
        })
        this.myJoinedGroups(token, city)
        this.hotGroups(token, city)
      }
    })
  },
  onReachBottom: function(){
		const { token } = app.globalData.entities.loginInfo
    const { city, page, bottom_line } = this.data
    if(bottom_line){
      let new_page = page + 1
      this.setData({
        page: new_page
      })
      this.hotGroups(token, city, new_page)
    }
	},
  gotoSearch: function(){
    wx.navigateTo({
      url: `/src/search/search`
    })
    this.clearData()
  },
  gotoLineInfo: function(e){
    const { currentTarget: { dataset: { id, type } } } = e
    wx.navigateTo({
      url: `/src/lineInfo/lineInfo?groupId=${id}&groupType=${type}`
    })
    this.clearData()
  },
  gotoMygroupList: function(){
    const { city } = this.data
    wx.navigateTo({
      url: `/src/lineInfo/linePeopleList?city=${city}&type=index`
    })
    this.clearData()
  },
  clearData: function(){
    this.setData({
      myGroup: [],
      isRecommend: true,
      hotGroups: [],
      page: 1
    })
  },
  _cancelEvent(){
    this.authorized = this.selectComponent("#authorized");
    this.authorized.hideDialog()
    this.getLocationCity(null, 'noAuthorized')
    // this.setData({
    //   isAuthorized: false
    // })
  }
})
