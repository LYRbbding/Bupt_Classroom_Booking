// miniprogram/pages/Me/MyGroups/GroupDetails/Me_Groups_privacy.js

Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
    navigation_background: 'nav-color-default',
    SaveLoading: false,
    SubmitDisabled: false,
    privacyItems: [
      { name: '允许任何人加入本团体', value: '0', checked: false },
      { name: '需要管理员审批', value: '1', checked: false }
    ],
    qrcodeItems: [
      { name: '允许任何人邀请', value: '0', checked: false },
      { name: '仅管理员可邀请', value: '1', checked: false }
    ],
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    this.data.group_id = options.group_id
    this.data.privacy = options.privacy
    this.setData({
      navigation_background: options.navigation_color,
      button_color: options.button_color
    })
    this.data.qrcodeItems[Number(this.data.privacy.charAt(0))].checked = true
    this.data.privacyItems[Number(this.data.privacy.charAt(1))].checked = true
    this.setData({
      qrcodeItems: this.data.qrcodeItems,
      privacyItems: this.data.privacyItems
    })
  },

  radioChange: function (e) {
    console.log(e)
    var target = e.currentTarget.id
    var radioItems = (target == 'privacy' ? this.data.privacyItems : this.data.qrcodeItems)
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      [target + 'Items']: radioItems
    });
  },

  UpdateInfo: function () {
    var t1 = (this.data.qrcodeItems[0].checked ? '0' : '1')
    var t2 = (this.data.privacyItems[0].checked ? '0' : '1')
    var privacy = t1 + t2
    if ((!this.data.SaveLoading) && this.data.privacy != privacy) {
      this.setData({
        SaveLoading: true
      })
      var that = this
      wx.cloud.callFunction({
        name: 'SearchGroupsMembers',
        data: {
          id: this.data.group_id,
          method: 'UpdateInfo',
          content: 'privacy',
          data: {
            privacy: privacy,
            verified_members: []
          }
        },
        success: function (res) {
          if (res.result.status == 'Success') {
            wx.showToast({
              title: '更新成功',
              icon: 'success',
            })
            setTimeout(() => {
              getApp().globalData.privacy = privacy
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          } else {
            wx.showToast({
              title: '更新失败',
              image: '../../../../images/error.png'
            })
          }
          that.setData({ SaveLoading: false })
        },
        fail: function (err) {
          wx.showToast({
            title: '更新失败',
            image: '../../../../images/error.png'
          })
          that.setData({ SaveLoading: false })
        }
      })
    }
    else if (this.data.privacy == privacy) {
      wx.navigateBack({
        delta: 1
      })
    }
  },

  GoBack: function () {
    wx.navigateBack({
      delta: 1
    })
  }

})