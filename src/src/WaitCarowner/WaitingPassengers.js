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
	gotoPassengerRoute: function (e) {
      wx.navigateTo({
      url: `/src/CarOwner/CommonCarOwners`
    })
  }
})