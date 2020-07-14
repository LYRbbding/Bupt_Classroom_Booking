// miniprogram/pages/Query/Query_detail.js
const days = ['周一', '周二', '周三', '周四', '周五']
const sections = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14']
Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    this.setData({
      classroom: options.classroom,
      day: days[parseInt(options.column)],
      section: '第' + sections[parseInt(options.row)] + '节',
      detail: getApp().globalData.query_detail
    }, () => {
      getApp().globalData.query_detail = undefined
    })
  },
})