import moment from './moment'
var amapFile = require('./amap-wx')
var myAmapFun = new amapFile.AMapWX({key:'35d96308ca0be8fd6029bd3585064095'})

// 地图回调函数
export const setStorageSync = (obj = {}) => {
  const { key, data } = obj
  try {
    wx.setStorageSync(key, data)
  } catch (e) {
  }
}
// 时间封装
// 
// 天数
export const selectDay = () => {
  const moment = require('./moment')
  let dayArray = []
  let showDayArray = []
  for(let i = 1; i <= 7; i++ ){
    dayArray.push(moment().add(i - 1, 'days').toDate().pattern('yyyy-MM-dd'))
    switch (i) {
      case 1:
        showDayArray.push('今天')
        break;
      case 2:
        showDayArray.push('明天')
        break;
      case 3:
        showDayArray.push('后天')
        break;
      default:
       showDayArray.push(moment().add(i - 1, 'days').toDate().pattern('MM月dd日'))
    }
  }
  let parmas = Object.assign({}, {showDayArray: showDayArray}, {dayArray: dayArray})
  return parmas
}
// 小时
export const selectHour = () => {
  let showArray = []
  let hourArray = []
  for(let i = 0; i <= 23; i++){
    if(i < 10){
      showArray.push('0' + i + '时')
      hourArray.push('0' + i)
    }else{
      showArray.push(i + '时')
      hourArray.push(i)
    }
  }
  let parmas = Object.assign({}, {showHourArray: showArray}, {hourArray: hourArray})
  return parmas
}
// 分钟
export const selectMinute = () => {
  let showMinuteArray = []
  let new_showMinuteArray = []
  let minuteArray = []
  let mew_minuteArray = []
  for(let i = 0; i < 60; i++){
      if(i < 10){
        showMinuteArray.push('0' + parseInt(i/10)*10 + '分')
        minuteArray.push('0' + parseInt(i/10)*10)
      }else{
        showMinuteArray.push(parseInt(i/10)*10 + '分')
        minuteArray.push(parseInt(i/10)*10)
      }
  }
  for(var i = 0; i < showMinuteArray.length - 1; i++){
　　 if(new_showMinuteArray.indexOf(showMinuteArray[i]) == -1){
        new_showMinuteArray.push(showMinuteArray[i]);
　　 }
    if(mew_minuteArray.indexOf(minuteArray[i]) == -1){
        mew_minuteArray.push(minuteArray[i]);
　　 }
  }
  let parmas = Object.assign({}, {showMinuteArray: new_showMinuteArray}, {minuteArray: mew_minuteArray})
  return parmas
}
// 座位数  乘车人数
export const seatsNumber = (type) => {
  let array = []
  for (let i = 0; i <= 4; i++){
    if(i === 0){
      array.push(type == 'people' ? '乘车人数' : '座位数')
    }else{
      array.push(type == 'people' ? i + '人乘车' : i + '个座位')
    }
  }
  return array
}
// 票价
export const seatsNumberTwo = (type) => {
  let array = []
  for (let i = 5; i <= 20; i++){
    if(i === 0){
      array.push(type == 'people' ? '乘车人数' : '票价')
    }else{
      array.push(type == 'people' ? i + '人乘车' : i + '元/位')
    }
  }
  return array
}
// 获取当前位置
export const loactionAddress = (callback) => {
  return new Promise((resolve, reject) => {
    myAmapFun.getRegeo({
      success:function(data){
          let address = data[0].regeocodeData.formatted_address.replace((data[0].regeocodeData.addressComponent.province + data[0].regeocodeData.addressComponent.district),"")
          let startLocation = [data[0].longitude, data[0].latitude]
          let latitude = data[0].latitude
          let longitude = data[0].longitude
          let search_location = [data[0].longitude, data[0].latitude]
          let city = data[0].regeocodeData.addressComponent.city.length == 0 ? data[0].regeocodeData.addressComponent.province : data[0].regeocodeData.addressComponent.city
          let district = data[0].regeocodeData.addressComponent.district
          let province = data[0].regeocodeData.addressComponent.province
          let params = {
            startAddress: address,
            startLocation: startLocation,
            latitude: latitude,
            longitude: longitude,
            search_location: search_location,
            initial_city: city,
            district: district,
            province: province
          }
          resolve(params)
      },
      fail:function(e){
        wx.hideLoading()
        wx.getSetting({
          success: function(res){
            if(res.authSetting['scope.userLocation']){
              return
            }else{
              wx.showModal({
                title: '提示',
                content: '获取当前位置失败',
                confirmText: '确定',
                success(){
                  if (wx.openSetting) {
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting['scope.userLocation']) {
                          // callback()
                        }
                      }
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                    })
                  }
                }
              })
            }
          }
        })
        reject()
      }
    })
  })
}