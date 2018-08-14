Page({
	data: {

	},
	onLoad(options){
		console.log(options,'---------???')
	},
	gotoPay : function () {
	    wx.navigateTo({
	      url: '/pagesIndex/pages/Pay/Pay',
	    })
	}
})