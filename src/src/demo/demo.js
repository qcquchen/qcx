import moment from '../../js/moment'
Page({
	data: {
		demoItem: {
			aaa: 'aaa',
			bbb: 'bbb',
			ccc: 'ccc'
		},
		item: [1,2,3,4,5,6]
	},
	onLoad(){
		console.log(moment().subtract(30, 'days').from(),'-----------date')
		let data = this.data.demoItem
		let object = [1,2,4]
		this.aaa(...this.data.item)
	},
	click: function(id, type, data){
		console.log('aaaaaaaaaa')
	},
	aaa: function(id, type, data){
		console.log(id)
		console.log(type)
		console.log(data)
	}
})