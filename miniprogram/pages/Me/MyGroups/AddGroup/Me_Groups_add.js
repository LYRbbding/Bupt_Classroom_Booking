// miniprogram/pages/Me/MyGroups/AddGroup/Me_groups_add.js// miniprogram/pages/Me/MyGroups/GroupDetails/Me_Groups_details.js
const QR = require('../../../../utils/weapp-qrcode.js')

Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
    image: '/images/group.png',
    type: '',
    members_title: '团体成员',
    AddLoading: false,
    privacy: '00'
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    var global_group = getApp().globalData.group_temp
    this.setData({
      image: global_group.group_image,
      image_color: global_group.group_image == '/images/group.png' ? global_group.group_image_color : '',
      image_text: global_group.group_image == '/images/group.png' ? global_group.group_image_text : '',
      name: global_group.group_name,
      privacy: global_group.privacy,
      description: global_group.group_description,
      type: global_group.group_type == 'associations' ? global_group.subtype : '班级',
      openid: getApp().globalData.openid
    })
  },

  AddGroup: function () {
    if (!this.data.AddLoading) {
      var that = this
      this.setData({ AddLoading: true })
      wx.cloud.callFunction({
        name: 'SearchGroupsMembers',
        data: {
          id: getApp().globalData.group_temp._id,
          method: 'addMembers'
        },
        success: function (result) {
          if (result.result.result == 'Fail') {
            wx.showToast({
              title: '拉取失败',
              image: '../../../../images/error.png'
            })
          }
          else if (result.result.addStatus == 'Add Members Success') {
            wx.showToast({
              title: '加入成功',
              icon: 'success',
            })
            getApp().globalData.currentGroup = getApp().globalData.group_temp
            setTimeout(() => {
              wx.redirectTo({
                url: '../GroupDetails/Me_Groups_details?group_id=' + getApp().globalData.group_temp._id,
              })
            }, 1500)
          }
          else if (result.result.addStatus == 'Wait Approval Success') {
            wx.showToast({
              title: '已发送申请',
              icon: 'success',
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
          else {
            wx.showToast({
              title: '再试一次',
              image: '../../../../images/error.png'
            })
          }
          that.setData({ AddLoading: false })
        },
        fail: function (err) {
          wx.showToast({
            title: '网络异常',
            image: '../../../../images/error.png'
          })
          that.setData({ AddLoading: false })
        }
      })
    }
  }

})