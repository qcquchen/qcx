const Host={
  passenger:'https://t1.passenger.quchuxing.com.cn',//乘客
  driver:'https://t1.driver.quchuxing.com.cn'//车主
}

var Data = {
  token:'',
  phone:''
}

module.exports = {
  Data: Data,
  ajax: function (e, r, t) {
      wx.request({
        url: Host[e[1]] + r[0], 
        method: e[0], 
        data: r[1],
        success(res) {
          t(res)
        }, fail(res){
          t(res)
        }
      })
  }
}