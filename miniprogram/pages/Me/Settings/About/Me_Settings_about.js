// miniprogram/pages/Me/Settings/About/Me_Settings_about.js
Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
    isSmallScreen: false,
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    if (wx.getSystemInfoSync().windowHeight < 650) {
      this.setData({
        isSmallScreen: true
      })
    }
  },

})