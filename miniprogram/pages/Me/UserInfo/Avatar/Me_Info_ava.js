// miniprogram/pages/Me/UserInfo/Avatar/Me_Info_ava.js
Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
    profile_photo: '',
    error: '',
    error_status: false,
    success: '',
    success_status: false
  },

  userinfo: function (e) {
    console.log(e)
    try {
      this.setData({
        profile_photo: e.detail.userInfo.avatarUrl.slice(0, -3) + '0'
      })
      this.setData({
        success: '获取成功，即将返回信息页',
        success_status: true
      })
    } catch (e) {
      this.setData({
        error: '获取失败，请手动授权',
        error_status: true
      })
    }
  },

  GoBack: function () {
    wx.navigateBack({ delta: 1 })
    wx.cloud.callFunction({
      name: 'UpdateDatabase',
      data: {
        collection: 'UserRelationship',
        place: {
          _openid: getApp().globalData.openid
        },
        data: {
          avatarUrl: this.data.profile_photo
        }
      },
      success: function (result) {
        console.log(result)
      },
      fail: function (err) {
        console.log('fail', err)
      }
    })
    wx.cloud.callFunction({
      name: 'UpdateDatabase',
      data: {
        collection: 'StudentInfo',
        place: {
          _openid: getApp().globalData.openid
        },
        data: {
          _avatarUrl: this.data.profile_photo
        }
      },
      success: function (result) {
        console.log(result)
      },
      fail: function (err) {
        console.log('fail', err)
      }
    })
  }
})