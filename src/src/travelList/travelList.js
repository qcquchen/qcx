import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
import { WATER_BILL_TYPE, TRAVEL_TYPE } from '../../js/constants'
var app = getApp()

Page({
  data: {
    userInfo: {},
    travelVoList: [],
    videoHeight: 300,
    masking: true,
    minePhone: '',
    code_type: 'travel',
    moneyIncome : 0.00,
    moneyCard : 0.00,
    aliPay : '',
    waterBill : [],
    WATER_BILL_TYPE: WATER_BILL_TYPE,
    TRAVEL_TYPE: TRAVEL_TYPE,
    page: 1,
    share_code: false,
    draw_type: false
  },
  onShow(){
    const { token, phone } = app.globalData.entities.loginInfo
    let self = this
    const { appLaunch } = app.globalData
    if(appLaunch){
      self.initData()
    }else{
      app.getWechatInfo().then(() => {
        wx.showLoading({
          title: '加载中',
        })
        self.initData()
      })
    }
  },
  initData(){
    let self = this
    const { deviceInfo } = app.globalData.entities
    const { page } = this.data
    wx.getUserInfo({
      withCredentials: true,
      success (res) {
        self.setData({
          userInfo: res.userInfo,
          videoHeight: deviceInfo.windowHeight
        })
      }
    })
    this.getUserInfo(page)
  },
  switch_code: function(e){
      const { currentTarget: { dataset: { id } } } = e
      const { page } = this.data
      if(id === 'wallet'){
        this.getMoneyDetails()
      }
      // if(id === 'travel'){
      //   this.getMineAllTravel(page)
      // }
      this.setData({
        code_type: id
      })
  },
  getUserInfo(page){
    const { token, phone } = app.globalData.entities.loginInfo
    driver_api.getUserInfo({
      data: {
        token: token,
        otherPhone: phone
      }
    }).then(json => {
      const { personalInfo } = json.data
      this.setData({
        personalInfo: personalInfo,
        minePhone: phone
      })
      this.getMineAllTravel(page)
    })
  },
  getMineAllTravel(page){
    const { token } = app.globalData.entities.loginInfo
    driver_api.getMineAllTravel({
      data: {
        token: token,
        pageNo: page
      }
    }).then(json => {
      const { travelVoList } = this.data
      const { result } = json.data
      result && result.map(json => {
				if(json.surplusSeats != 0){
          let seat_true = util.seats_true(json.seats - json.surplusSeats)
          let seat_false = util.seats_false(json.surplusSeats)
          json.seat_true = seat_true
          json.seat_false = seat_false
        }else{
          let seat_true = util.seats_true(json.seats)
      	  json.seat_true = seat_true
        }
        travelVoList.push(json)
      })
      this.setData({
        travelVoList: travelVoList,
        bottom_line: result.length != 0 ? true : false,
        nickName: json.data.nickName,
        car: json.data.car,
        picture: json.data.picture,
        sex: json.data.sex
      })
    })
  },
  cancelTravel:function(e){
    const { travelVoList } = this.data
    const { currentTarget: { dataset: { id } } } = e
    let data = travelVoList.find(json => json.travelId == id)
    if(data.type == 1){
      if(data.status == 3){
        this.beforePassengerDelete(data.travelId, data.type)
      }
      if(data.status == 4){
        this.beforePassengerDelete(data.passengerTravelId, data.type)
      }
    }
    if(data.type == 2){
      if(data.status == 5){
        this.closeWxPay(data.ordersId)
      }
      if(data.status == 6){
        this.cancelTheTrip(data.ordersTravelId)
      }
      if(data.status == 8){
        wx.showModal({
          title: '提示',
          content: '车主已发车, 不能取消行程',
          showCancel: false
        })
        return
      }
    }
    if(data.type == 0 || data.type == 3){
      this.deleteTravel(id)
    }
  },
  closeWxPay: function(id){
    const { token } = app.globalData.entities.loginInfo
    const { travelVoList } = this.data
    let self = this
    wx.showModal({
      title: '提示',
      content: '确定取消行程吗',
      success: function(res) {
        if (res.confirm) {
          passenger_api.closeWxPay({
            data: {
              ordersId: id,
              token: token
            }
          }).then(json => {
            if(json.data.status == 200){
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 2000
              })
              let index = travelVoList.findIndex(json => json.travelId == id)
              travelVoList.splice(index, 1)
              self.setData({
                travelVoList: travelVoList
              })
            }
          })
        }
      }
    })
  },
  deleteTravel: function(id){
    const { token } = app.globalData.entities.loginInfo
    const { travelVoList } = this.data
    let self = this
    wx.showModal({
      title: '提示',
      content: '确定取消行程吗',
      success: function(res) {
        if (res.confirm) {
          driver_api.deleteTravel({
            data: {
              token: token,
              travelId: id
            }
          }).then(json => {
            if(json.data.status == 200){
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 2000
              })
              let index = travelVoList.findIndex(json => json.travelId == id)
              travelVoList.splice(index, 1)
              self.setData({
                travelVoList: travelVoList
              })
            }
          })
        }
      }
    })
  },
  cancelTheTrip: function(id){
    const { token } = app.globalData.entities.loginInfo
    const { travelVoList } = this.data
    let self = this
    wx.showModal({
        title: '提示',
        content: '确定要取消行程嘛？',
        success: function(res){
          if (res.confirm) {
            passenger_api.deletePeopleTravel({
            data: {
              token: token,
              ordersTravelId: id
            }
          }).then(json => {
            if(json.data.status == 110){
              let index = travelVoList.findIndex(json => json.travelId == id)
              travelVoList.splice(index, 1)
              self.setData({
                travelVoList: travelVoList
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
          })
          }
        }
    })
  },
  beforePassengerDelete: function(id, type){
    const { token } = app.globalData.entities.loginInfo
    const { travelVoList } = this.data
    let self = this
    wx.showModal({
      title: '提示',
      content: '确定取消行程吗',
      success: function(res) {
        if (res.confirm) {
          passenger_api.beforePassengerDelete({
            data: {
              token: token,
              passengerTravelId: id
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
              let index = travelVoList.findIndex(json => json.travelId == id)
              travelVoList.splice(index, 1)
              self.setData({
                travelVoList: travelVoList
              })
            }
          })
        }
      }
    })
  },
  shareClick:function(e){
    const { currentTarget: { dataset: { id } } } = e
    const { travelVoList } = this.data
    let order = travelVoList.find(json => json.travelId == id)
    this.setData({
      travel_order: order,
      masking: false
    })
  },
  closeShare: function(){
    this.setData({
      masking: true
    })
  },
  onShareAppMessage() {
		const { travel_order } = this.data
    const { token } = app.globalData.entities.loginInfo
    let self = this
    return {
      title: travel_order.type === 1 || travel_order.type === 2 ? '人找车 车主快来抢单吧~' : '车找人 乘客快来订座吧~',
      path: `/src/travelInfo/travelInfo?travelId=${travel_order.travelId}&phone=${travel_order.travelPhone}&travelType=${travel_order.type}`,
      success(res){
	    	driver_api.shareTravel({
					data: {
						token: token,
						travelId: travel_order.travelId,
						travelType: Number(travel_order.type)
					}
				}).then(json => {
					if(json.data.status == 200){
						wx.showToast({
						  title: '分享成功',
						  icon: 'success',
						  duration: 2000
						})
            self.setData({
              masking: true
            })
					}
				})
      }
    }
  },
  clearLogin: function(){
    wx.showModal({
      title: '提示',
      content: '宋丹，你确定要退出嘛？',
      success: function(res) {
        if(res.confirm) {
          const { loginInfo } = app.globalData.entities
          driver_api.loginOut({
            data: {
              phone: loginInfo.phone
            }
          }).then(json => {
            if(json.data.status == 200){
              let clear_loginInfo = Object.assign({}, {openId: loginInfo.openId}, {isLogin: true})
              util.setEntities({
                key: 'loginInfo',
                value: clear_loginInfo
              })
              wx.switchTab({
                url: `/src/index`
              })
            }
          })
        }
      }
    })
  },
  getMoneyDetails(){
    const { token } = app.globalData.entities.loginInfo
    driver_api.getMoneyDetails({
      data:{
        token: token
      }
    }).then(json => {
      let data = json.data
      let moneyIncome = data.moneyIncome
      let moneyCard = data.moneyCard
      let aliPay = data.aliPay
      let waterBill = data.waterBill
      this.setData({
        moneyIncome : data.moneyIncome,
        moneyCard : data.moneyCard,
        aliPay : data.aliPay,
        waterBill : data.waterBill
      })
    })
  },
  withdraw: function(){
    util.gotoApp()
  },
  clickTravelType: function(e){
    const { currentTarget: { dataset: { id } } } = e
    switch (id){
      case 5:
        // console.log('222222222')
      break;
    }
  },
  gotoTravelInfo: function(e){
    const { currentTarget: { dataset: { id, type } } } = e
    const { travelVoList } = this.data
    let data = travelVoList.find(json => json.travelId == id)
    switch (type){
      case 1:
      case 2:
        wx.showModal({
          title: '提示',
          content: '小程序暂不支持查看行程详情，请前往【趣出行】APP。',
          showCancel: false
        })
        break;
      case 0:
        wx.navigateTo({
          url: `/src/matchTravel/matchTravel?travelId=${data.travelId}&type=1`
        })
        this.clearData()
        break;
      case 3:
        wx.navigateTo({
          url: `/src/matchTravel/matchTravel?travelId=${data.travelId}&type=0`
        })
        this.clearData()
        break;
      case 4:
        wx.navigateTo({
          url: `/src/travelList/myTravelInfo?travelType=${type}&&travelId=${data.travelId}`
        })
        this.clearData()
        break;
      case 5:
        wx.navigateTo({
          url: `/src/travelList/myTravelInfo?travelType=${type}&&travelId=${data.ordersTravelId}`
        })
        this.clearData()
        break;
      case 6:
      case 7:
      case 8:
        wx.navigateTo({
          url: `/src/travelList/myTravelInfo?travelType=${type}&&travelId=${data.ordersTravelId}`
        })
        this.clearData()
        break;
      case 9:
      case 11:
      case 12:
        wx.showModal({
          title: '提示',
          content: '小程序暂不支持查看行程详情，请前往【趣出行】APP。',
          showCancel: false
        })
        break;
    }
  },
  onReachBottom: function(){
    const { token } = app.globalData.entities.loginInfo
    const { page, bottom_line } = this.data
    if(bottom_line){
      let new_page = page + 1
      this.setData({
        page: new_page
      })
      this.getMineAllTravel(new_page)
    }
  },
  clearData: function(){
    this.setData({
      travelVoList: [],
      page: 1
    })
  },
  onHide(){
    this.clearData()
  },
  canvasShare:function(e){
    let that = this
    const { currentTarget: { dataset: { id, type } } } = e
    switch(Number(type)){
      case 2:
      case 4:
      case 5: 
      case 6: 
      case 7: 
      case 8: 
      case 11:
      case 12:
        wx.showModal({
            title: '提示',
            content: `行程${TRAVEL_TYPE[type]},不能分享`,
            showCancel: false
        })
        return
      break;
    }
    this.setData({
      share_code: true
    })
    wx.showLoading({
      title: '加载中',
    })
    let ctx_friends = wx.createCanvasContext('shareFriends')
    let { travelVoList, nickName, car, picture } = this.data
    let data = travelVoList.find(json => json.travelId == id)
    let time_icon = "../../images/icon_time@3x.png"
    let start_icon = "../../images/icon_map_star@3x.png"
    let end_icon = "../../images/icon_map_end@3x.png"
    let submit_bg = data.type == 0 ? "../../images/btn_dingzuo@2x.png" : "../../images/btn_qiandan@2x.png"
    this.getWechatCode(data.travelId, data.type).then((res) => {
      util.getServiceImg(picture).then(avatar_res => {
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
              share_Id: data.travelId,
              share_type: data.type,
              draw_type: true
            })
          },
          complete: function(){
            wx.hideLoading()
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
    const { nickName } = this.data
    let title = data.type == 0 ? `我是车主${nickName}，乘客快来订座吧` : `我是乘客${nickName}，车主快来抢单吧`
    ctx_friends.beginPath()
    ctx_friends.setFontSize(16)
    ctx_friends.setFillStyle("#484848")
    ctx_friends.fillText(title, 10, 30)
    ctx_friends.stroke()

    this.settextFir(ctx_friends, data)
  },
  settextFir: function (ctx_friends, data) {
    const { nickName, sex } = this.data
    let that=this
    let size = that.setCanvasSize()
    let sex_txt = ''
    if(sex == 1){
      sex_txt = '男'
    }else if(sex == 2){
      sex_txt = '女'
    }else{
      sex_txt = '保密'
    }
    let name = `${nickName}·${sex_txt}` 
    ctx_friends.beginPath()
    ctx_friends.setFontSize(14)
    ctx_friends.setFillStyle("#484848")
    ctx_friends.fillText(name, 80, 85)
    ctx_friends.stroke()

    this.settextCar(ctx_friends, data)
  },
  settextCar: function (ctx_friends, data) {
    let that=this
    const { car } = this.data
    let car_name = car != null ? car : '无'
    ctx_friends.beginPath()
    ctx_friends.setFontSize(12)
    ctx_friends.setFillStyle("#cccccc")
    ctx_friends.fillText(car_name, 80, 100)
    ctx_friends.stroke()

    this.settextInfo(ctx_friends, data)
  },
  settextInfo: function (ctx_friends, data) {
    let that=this
    let time = data.startTimeTxt
    let start = data.startAddress
    let end = data.endAddress
    ctx_friends.beginPath()
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
    let textSec = data.type == 0 ? `余座${data.surplusSeats} 每座${data.travelPrice}元` : `${data.seats}乘车 合计${data.travelPrice}元`
    ctx_friends.beginPath()
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
    ctx_friends.beginPath()
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
    const { share_img, share_Id, share_type } = this.data
    let type = share_type == 1 || share_type == 2 ? 1 : 0
    const { phone } = app.globalData.entities.loginInfo
    return {
      title: share_type == 0 ? '车找人，乘客快来订座吧' : '人找车，车主快来抢单吧',
      path: `/src/travelInfo/travelInfo?travelId=${share_Id}&travelType=${share_type}&phone=${phone}`,
      imageUrl: share_img
    }
  }
})
