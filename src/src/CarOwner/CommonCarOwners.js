var app = getApp()
Page({
	data: {
		showModal: false,
	    hiddenName:true,
	    demoItem: {
	      aaa: '上帝三街',
	      bbb: 'bbb',
	      ccc: 'ccc'
	    },
	    items: [
	      {name: 'USA', value: '周一'},
	      {name: 'CHN', value: '周二', checked: 'true'},
	      {name: 'BRA', value: '周三'},
	      {name: 'JPN', value: '周四'},
	      {name: 'ENG', value: '周五'},
	      {name: 'TUR', value: '周六'},
	      {name: 'TUR', value: '周日'},
	    ]
	},
	switch1Change: function (e){
	   console.log('switch1 发生 change 事件，携带值为', e.detail.value)
	},
  	// 常用添加为路线对话框
 	showDialogBtn: function () {
 		this.setData({
		    showModal: true
		}),
 		setTimeout(() => {
	      	this.setData({
		       showModal: false
		    })
	    },2000),
	    wx.navigateTo({
		    url: `/src/MyusualRoute/MyusualRoute`
		})
	},
	gotoCarOwnerReleased: function () {
		wx.navigateTo({
		    url: `/src/CarOwnerReleased/CarOwnerReleased`
		})
	},
	gotoDrivingRoute :function () {
		wx.navigateTo({
		    url: `/src/DrivingRoute/DrivingrRoute`
		})
	}   
})


