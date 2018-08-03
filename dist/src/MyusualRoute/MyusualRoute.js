var app=getApp()
Page({
	data:{
	    currentTab:0,
	    textTop:'今天9:30',
	    showModal: false,
	    textBottom:'红庙北里三十五号22栋'
  	},
    onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    },
  //主页点击滑动切换
    swiperTab:function( e ){
	    var that=this;
	    that.setData({
	      currentTba:e.detail.current
	    });
	},
  //主页点击切换
  	clickTab: function( e ) {  
	    var that = this;  
	    if( this.data.currentTab === e.target.dataset.current ) {  
	      return false;  
	    } else {  
	      that.setData( {  
	        currentTab: e.target.dataset.current  
	      })  
	    }  
    },
 	switch1Change: function (e){
	    // console.log('switch1 发生 change 事件，携带值为', e.detail.value)
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
	}
})