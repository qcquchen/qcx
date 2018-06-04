import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
var app = getApp()

Page({
	data: {
		myGroup: [],
		page: 1
	},
	onLoad(options){
		const { city } = options
    	const { token } = app.globalData.entities.loginInfo
    	const { page } = this.data
    	this.setData({
    		options: options
    	})
    	if(options.type === 'index'){
    		this.myJoinedGroups(token, city, page)
    	}else{
    		this.searchTravel(token, options.start_addr, options.start, options.end_addr, options.end, page)
    	}
	},
	myJoinedGroups: function(token, city, page){
	    let parmas = Object.assign({}, {token: token}, {currentCity: city}, {pageNo: page})
	    const { myGroup } = this.data
	    driver_api.myJoinedGroups({data: parmas}).then(json => {
	      let data = json.data.myJoinedGroups.groupsList
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
	      	myGroup.push(json)
	      })
	      this.setData({
	        myGroup: myGroup,
	        bottom_line: data.length != 0 ? true : false
	      })
	    })
	},
	searchTravel: function(token, start_addr, start_loc, end_addr, end_loc, page){
		let parmas = Object.assign({}, {token: token}, {startAddress: start_addr}, {startLocation: start_loc}, {endAddress: end_addr}, {endLocation: end_loc}, {pageNo: page})
		const { myGroup } = this.data
		driver_api.searchTravel({
			data: parmas
		}).then(json => {
			let data = json.data.groupLines
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
		      	myGroup.push(json)
		    })
		    this.setData({
		        myGroup: myGroup,
		        bottom_line: data.length != 0 ? true : false
		    })
		})
	},
	onReachBottom: function(){
		const { token } = app.globalData.entities.loginInfo
	    const { page, bottom_line, options } = this.data
	    if(bottom_line){
	      let new_page = page + 1
	      this.setData({
	        page: new_page
	      })
	      if(options.pageType === 'index'){
	      	this.myJoinedGroups(token, options.city, new_page)
	      }else{
	      	this.searchTravel(token, options.start_addr, options.start, options.end_addr, options.end, page)
	      }
	    }
	},
	gotoLineInfo: function(e){
		const { currentTarget: { dataset: { id, type } } } = e
		wx.navigateTo({
		  url: `/src/lineInfo/lineInfo?groupId=${id}&groupType=${type}`
		})
	}
})