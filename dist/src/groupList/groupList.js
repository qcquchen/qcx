import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
var app = getApp()

Page({
  data: {
  	page: 1,
  	group_list: []
  },
  onLoad(options){
  	const { page } = this.data
  	this.groupMembers(options, page)
  },
  groupMembers: function(ops, page_par){
    const { token } = app.globalData.entities.loginInfo
    const { group_list, page } = this.data
  	driver_api.groupMembers({
  		data: {
  			token: token,
  			groupId: ops.groupId,
  			pageNo: page_par
  		}
  	}).then(json => {
  		let data = json.data
  		data.members && data.members.map(json => {
  			group_list.push(json)
  		})
  		wx.setNavigationBarTitle({
		  title: `群成员${data.membersCount}`
		})
  		this.setData({
  			group_list: group_list,
  			options: ops,
        bottom_line: data.members.length != 0 ? true : false
  		})
  	})
  },
  likeHe: function(e){
  	const { currentTarget: { dataset: { id } } } = e
    const { token } = app.globalData.entities.loginInfo
    const { group_list } = this.data
  	driver_api.postAttention({
  		data: {
  			token: token,
  			attentione: id
  		}
  	}).then(json => {
  		if(json.data.isAttention == 1 || json.data.isAttention == 2){
  			wx.showToast({
	          title: '已关注',
	          icon: 'success',
	          duration: 2000
	        })
	        group_list.map(json => {
	        	if(json.phone == id){
	        		json.isAttention = !json.isAttention
	        	}
	        })
	        this.setData({
	        	group_list: group_list
	        })
  		}
  	})
  },
  pullAttention: function(e){
  	const { currentTarget: { dataset: { id } } } = e
    const { token } = app.globalData.entities.loginInfo
    const { group_list } = this.data
  	driver_api.pullAttention({
  		data: {
  			token: token,
  			attentionPhone: id
  		}
  	}).then(json => {
  		if(json.data.isAttention === 0){
  			wx.showToast({
	          title: '取消关注',
	          icon: 'success',
	          duration: 2000
	        })
	        group_list.map(json => {
	        	if(json.phone == id){
	        		json.isAttention = !json.isAttention
	        	}
	        })
	        this.setData({
	        	group_list: group_list
	        })
  		}
  	})
  },
  onReachBottom: function(){
    const { token } = app.globalData.entities.loginInfo
      const { options, bottom_line, page } = this.data
      if(bottom_line){
        let new_page = page + 1
        this.setData({
          page: new_page
        })
        this.groupMembers(options, new_page)
      }
  }
})
