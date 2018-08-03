var app = getApp()
Page({
	data: {
		showModal: false,
	    demoItem: {
	      aaa: '上帝三街',
	      bbb: 'bbb',
	      ccc: 'ccc'
	    }
	},

    // 存为常用路线对话框
 	showDialogBtn: function () {
	    this.setData({
	       showModal: true
	    })
	},
	hideModal: function () {
	    this.setData({
	      showModal: false
	    });
	},
	onCancel: function () {
	    this.hideModal();
	},
	onConfirm: function () {
	    this.hideModal();
	},
	// BulletBox:function(){
	// 	wx.showToast({
	//      title: '发布成功',
	//      icon: 'Loading',
	//      duration: 2000//持续的时间
	//    })
	// },
	// 发布成功对话框
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
		  url: `/src/WaitCarowner/WaitingPassengers`
		})
	}
})


