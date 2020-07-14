// miniprogram/pages/Me/Settings/Me_settings.js
Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
    info: '',
    info_status: false,
    error: '',
    error_status: false,
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) { },
  //生命周期函数--监听页面初次渲染完成
  onReady: function () { },
  //生命周期函数--监听页面显示
  onShow: function () { },
  //生命周期函数--监听页面隐藏
  onHide: function () { },
  //生命周期函数--监听页面卸载
  onUnload: function () { },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () { },
  //页面上拉触底事件的处理函数
  onReachBottom: function () { },
  //用户点击右上角分享
  onShareAppMessage: function () { },

  clearStorage: function () {
    try {
      wx.clearStorage()
      wx.clearStorageSync()
      this.setData({
        info: '清理完成',
        info_status: true
      })
    } catch (e) {
      this.setData({
        error: '清理失败，请重试',
        error_status: true
      })
    }
  },

  GotoAbout: function () {
    wx.navigateTo({
      url: './About/Me_Settings_about'
    })
  },

  GoToSubscription: function () {
    wx.navigateTo({
      url: './Subscription/Me_Settings_subscription'
    })
  }

})