import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'

var app = getApp()

Page({
	data: {
		one_img: '',
		two_img: ''
	},
	onLoad(){

	},
	getCarCode: function(e){
		this.setData({
			car_code: e.detail.value
		})
	},
	getCarModel: function(e){
		this.setData({
			car_model: e.detail.value
		})
	},
	getCarColor: function(e){
		this.setData({
			car_color: e.detail.value
		})
	},
	getName: function(e){
		this.setData({
			car_name: e.detail.value
		})
	},
	getDriverLicense: function () {
		let self = this
	    wx.chooseImage({
		  success: function(res) {
		    var tempFilePaths = res.tempFilePaths
		    self.setData({
		    	driver_licence: tempFilePaths,
		    	one_img: tempFilePaths ? tempFilePaths[0] : '',
		    })
		  }
		})
	},
	submitDriverLicense: function(){
		const { one_img } = this.data
		const { token } = app.globalData.entities.loginInfo
	    wx.uploadFile({
			url: 'https://v1.driver.quchuxing.com.cn/driver/upload/audit_weapp',
			filePath: one_img,
			name: 'driverLicencePictureMain',
			formData:{
				'token': token
			},
			header: {
				'content-type': 'multipart/form-data'
			},
			success(res){
			}
	    })
	},
	getDrivingLicense: function () {
		let self = this
	    wx.chooseImage({
		  success: function(res) {
		    var tempFilePaths = res.tempFilePaths
		    self.setData({
		    	driving_licence: tempFilePaths,
		    	two_img: tempFilePaths ? tempFilePaths[0] : '',
		    })
		  }
		})
	},
	submitDrivingLicense: function(){
		const { token } = app.globalData.entities.loginInfo
		const { two_img } = this.data
	    wx.uploadFile({
			url: 'https://v1.driver.quchuxing.com.cn/driver/upload/audit_weapp',
			filePath: two_img,
			name: 'drivingLicensePictureMain',
			formData:{
				'token': token
			},
			header: {
				'content-type': 'multipart/form-data'
			},
			success(res){
			}
	    })
	},
	submit: function(){
		const { car_code, car_model, car_color, car_name, one_img, two_img } = this.data
	    const { token } = app.globalData.entities.loginInfo
	    if(!car_name){
	        wx.showModal({
	          title: '提示',
	          content: '请输入真实姓名',
	          showCancel: false
	        })
	        return
	    }
	    if(!car_code){
	        wx.showModal({
	          title: '提示',
	          content: '请输入车牌号',
	          showCancel: false
	        })
	        return
	    }
	    if(!(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/.test(car_code))){
	    	 wx.showModal({
	          title: '提示',
	          content: '请输入正确的车牌号',
	          showCancel: false
	        })
	    	return
	    }

	    if(!one_img){
	        wx.showModal({
	          title: '提示',
	          content: '请上传驾驶证',
	          showCancel: false
	        })
	        return
	    }
	    if(!two_img){
	        wx.showModal({
	          title: '提示',
	          content: '请上传行驶证',
	          showCancel: false
	        })
	        return
	    }
	    if(!car_model || !car_color){
	        wx.showModal({
	          title: '提示',
	          content: '请填写正确的车型和车体颜色',
	          showCancel: false
	        })
	        return
	    }
    	let parmas = Object.assign({}, {token: token}, {carNumber: car_code}, {car: car_model + car_color}, {carMaster: car_name})
		driver_api.postCarInfo({
			data: parmas,
			header : {
		        'post_type': true
		    }
		}).then(json => {
			let data = json.data
			if(data.status == 200){
				this.submitDrivingLicense()
				this.submitDriverLicense()
				wx.showToast({
				  title: '成功',
				  icon: 'success',
				  duration: 2000
				})
				setTimeout(()=>{
					wx.navigateBack({
					  delta: 1
					})
				}, 2000)
			}
		})
	}
})
