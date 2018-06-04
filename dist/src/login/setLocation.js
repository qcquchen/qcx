import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
import * as constants from '../../js/constants'

var app = getApp()

Page({
	data: {
		home: '',
		company: ''
	},
	selectAddress: function(e){
		let self = this
		const { currentTarget: { dataset: { id } } } = e
		let location = []
		wx.getSetting({
			success: function(res){
				if(res.authSetting['scope.userLocation']){
					wx.chooseLocation({
						success: function(loc){
							location.push(loc.longitude)
							location.push(loc.latitude)
							if(id === 'home'){
								self.setData({
									home: loc.name,
									home_loc: location 
								})
							}
							if(id === 'company'){
								self.setData({
									company: loc.name,
									company_loc: location 
								})
							}
						} 
					})
				}else{
					wx.authorize({
		                scope: 'scope.userLocation',
		                success() {
		                    wx.chooseLocation({
								success: function(loc){
									location.push(loc.longitude)
									location.push(loc.latitude)
									if(id === 'home'){
										self.setData({
											home: loc.name,
											home_loc: location 
										})
									}
									if(id === 'company'){
										self.setData({
											company: loc.name,
											company_loc: location 
										})
									}
								} 
							})
		                },
		                fail: function(){
		                	wx.navigateBack({
								delta: 2
							})
		                }
		            })
				}
			}
		})
	},
	submit_add: function(){
		const { home, home_loc, company, company_loc } = this.data
		const { token } = app.globalData.entities.loginInfo
		if(home == ''){
			this.tipe('home')
			return
		}
		if(company == ''){
			this.tipe('company')
			return
		}
		driver_api.postHomeAndCompanyAddress({
			data: {
				token: token,
				addr_home: home,
				addr_company: company,
				location_home: home_loc,
				location_company: company_loc
			}
		}).then(json => {
			if(json.data.status == 200){
				wx.showToast({
				    title: '设置成功',
				    icon: 'success',
				    duration: 2000
				})
				setTimeout(() => {
					wx.navigateBack({
						delta: 2
					})
				}, 2000)
			}
		})
	},
	tipe: function(type){
		let title = type == 'home' ? '家' : '公司'
		wx.showModal({
		  title: '提示',
		  content: `请选择${title}地址`,
		  showCancel: false
		})
	},
	jump_over: function(){
		wx.navigateBack({
			delta: 2
		})
	}
})