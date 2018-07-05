// import * as amapFile from '../../js/amap-wx'

// Page({
//   data: {
//     tips: {}
//   },
//   onLoad: function(){

//   },
//   bindInput: function(e){
//     var that = this;
//     var keywords = e.detail.value; 
//     var key = config.Config.key;
//     var myAmapFun = new amapFile.AMapWX({key: '高德Key'});
//     myAmapFun.getInputtips({
//       keywords: keywords,
//       location: '',
//       success: function(data){
//         if(data && data.tips){
//           that.setData({
//             tips: data.tips
//           });
//         }

//       }
//     })
//   },
//   bindSearch: function(e){
//     var keywords = e.target.dataset.keywords;
//     var url = '../poi/poi?keywords=' + keywords;
//     console.log(url)
//     wx.redirectTo({
//       url: url
//     })
//   }
// })
Page({})