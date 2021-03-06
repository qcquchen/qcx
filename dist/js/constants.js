let extConfig = wx.getExtConfigSync? wx.getExtConfigSync(): {}

var amapFile = require('./amap-wx.js')

export const GAODESDK = new amapFile.AMapWX({key: '35d96308ca0be8fd6029bd3585064095'})

export const SELECT_TIME_DAY = [1,2,3,4,5,6,7]

export const SELECT_TIME_HOUR = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

export const SELECT_TIME_MINUTE = [0, 10, 20, 30, 40, 50]

export const SUBMIT_WXPAY = {
	'-1': '未登录',
	'-101': '创建订单失败，有未支付订单',
	'-106': '未实名认证',
	'-103': '已过期',
	'-107': '已发车',
	'-108': '没座了',
	'-302': '没有足够的座位',
	'-109': '行程已取消',
	'-105': '不能预订自己的行程',
	'-102': '创建订单失败'
}

export const WATER_BILL_TYPE = {
	'2': '车费收入',
	'3': '提现',
	'4': '打赏',
	'1': '提现失败流水',
	'0': '提现中流水',
	'9': '点赞红包',
	'10': '分享红包',
}

export const TRAVEL_TYPE = {
	'0': '匹配中',
	'1': '有乘客订座',
	'2': '已发车',
	'3': '等待接单',
	'4': '等待支付',
	'5': '未支付',
	'6': '已支付',
	'7': '已发车',
	'8': '行程中',
	'9': '等待支付',
	'11': '已支付',
	'12': '已发车',
}