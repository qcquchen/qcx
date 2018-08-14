// pages/mypage/carowner/carinfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    showtime: true,
    CarCode:'',
    CarModel:'',
    CarColor:'',
    driver_licence:'',
    driver_licences:''
  },
  getCarCode: function (e) {
    console.log(e)
    this.setData({
      CarCode: e.detail.value
    })
    console.log(this.data.CarCode)
  },
  getCarModel: function (e) {
    console.log(e)
    this.setData({
      CarModel: e.detail.value
    })
    console.log(this.data.CarModel)
  },
  getCarColor: function (e) {
    console.log(e)
    this.setData({
      CarColor: e.detail.value
    })
    console.log(this.data.CarColor)
  },
  /**
   * 跳转到选择车辆信息页面
   */
  // jumpCarType() {
  //   wx.navigateTo({
  //     url: './cartype'
  //   })
  // },
  /**
   * 跳转到后台审核页面
   */
  jumpCarAudit() {
    var user = wx.getStorageSync('userdata');
    if (this.data.CarCode && this.data.CarModel && this.data.CarColor && this.data.driver_licence && this.data.driver_licences !== ''){
      wx.uploadFile({
        url: 'https://v1.driver.quchuxing.com.cn/driver/upload/audit_weapp', //仅为示例，非真实的接口地址
        filePath: this.data.driver_licence[0],
        name: 'file',
        formData: {
          'token': user.token
        },
        success: function (res) {
          console.log(res)
          var data = res.data
          //do something
        }
      })
      wx.redirectTo({
        url: './caraudit'
      })
    }  
  },
  // 显示隐藏
  isShow() {
    this.setData({
      show: !this.data.show
    })
  },
  upShow() {
    this.setData({
      show: true
    })
  },
  isShowTime() {
    this.setData({
      showtime: !this.data.showtime
    })
  },
  upShowTime() {
    this.setData({
      showtime: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 拍照上传驾驶证
   */
  getDriverLicenseCamera () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        that.setData({
          driver_licence: tempFilePaths,
        })
        that.setData({
          show: true
        })
      }
    })
  },
  /**
   * 从相册选取驾驶证
   */
  getDriverLicenseAlbum () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        that.setData({
          driver_licence: tempFilePaths,
        })
        that.setData({
          show: true
        })
      }
    })
  },
  /**
   * 拍照上传本人/他人行驶证
   */
  getDriverLicenseCameras() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        that.setData({
          driver_licences: tempFilePaths,
        })
        that.setData({
          showtime: true
        })
      }
    })
  },
  /**
   * 从相册选取本人/他人行驶证
   */
  getDriverLicenseAlbums() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        that.setData({
          driver_licences: tempFilePaths,
        })
        that.setData({
          showtime: true
        })
      }
    })
  }
})