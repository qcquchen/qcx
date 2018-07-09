// Page({})

// const date = new Date()
// const years = []
// const months = []
// const days = []

// for (let i = 1990; i <= date.getFullYear(); i++) {
//   years.push(i)
// }

// for (let i = 1 ; i <= 12; i++) {
//   months.push(i)
// }

// for (let i = 1 ; i <= 31; i++) {
//   days.push(i)
// }

// Page({
//   data: {
//     years: years,
//     year: date.getFullYear(),
//     months: months,
//     month: 2,
//     days: days,
//     day: 2,
//     value: [9999, 1, 1],
//   },
//   bindChange: function(e) {
//     const val = e.detail.value
//     this.setData({
//       year: this.data.years[val[0]],
//       month: this.data.months[val[1]],
//       day: this.data.days[val[2]]
//     })
//   }
// })
// 



import moment from '../../js/moment'
Page({
  data: {
    demoItem: {
      aaa: '上帝三街',
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