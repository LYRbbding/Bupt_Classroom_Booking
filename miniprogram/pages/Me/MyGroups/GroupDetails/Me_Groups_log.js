// miniprogram/pages/Me/MyGroups/GroupDetails/Me_Groups_log.js

Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
    navigationbar_loading: false,
    navigation_background: 'nav-color-default',
    verifiedItems: [],
    nonew: '加载中',
    SubmitDisabled: true,
    AcceptLoading: false,
    RefuseLoading: false,
    verify_mem: []
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    this.data.group_id = options.group_id
    this.setData({
      navigationbar_loading: true,
      navigation_background: options.navigation_color,
      button_color: options.button_color
    })
    var that = this
    wx.cloud.callFunction({
      name: 'SearchGroupsMembers',
      data: {
        id: this.data.group_id,
        method: 'checkverified'
      },
      success: function (result) {
        if (result.result.member_ver != undefined) {
          that.setData({
            verifiedItems: result.result.member_ver
          })
          if (result.result.member_ver.length == 0) {
            that.setData({
              nonew: '暂无申请记录'
            })
          }
        }
        else {
          wx.showToast({
            title: '获取失败',
            image: '../../../../images/network.png'
          })
        }
      },
      fail: function (error) {
        wx.showToast({
          title: '网络异常',
          image: '../../../../images/network.png'
        })
      },
      complete: function () {
        that.setData({
          navigationbar_loading: false
        })
      }
    })
  },

  radioChange(e) {
    if (e.detail.value.length != 0) {
      this.setData({
        SubmitDisabled: false
      })
    }
    else {
      this.setData({
        SubmitDisabled: true
      })
    }
    this.data.verify_mem = e.detail.value
  },

  Accept(e) {
    if (!(this.data.AcceptLoading || this.data.RefuseLoading)) {
      this.setData({
        AcceptLoading: true
      })
      this.verify('accept')
    }
  },

  Refuse(e) {
    if (!(this.data.AcceptLoading || this.data.RefuseLoading)) {
      this.setData({
        RefuseLoading: true
      })
      this.verify('refuse')
    }
  },

  verify(way) {
    var that = this
    wx.cloud.callFunction({
      name: 'SearchGroupsMembers',
      data: {
        id: this.data.group_id,
        method: 'approveMembers',
        way: way,
        members: this.data.verify_mem
      },
      success: function (res) {
        if (res.result.status == 'Success') {
          wx.showToast({
            title: '成功',
            icon: 'success',
          })
          for (var i = that.data.verify_mem.length - 1; i >= 0; i--) {
            for (var j = that.data.verifiedItems.length - 1; j >= 0; j--) {
              if (that.data.verify_mem[i] == that.data.verifiedItems[j]._openid) {
                that.data.verify_mem.splice(i, 1)
                that.data.verifiedItems.splice(j, 1)
              }
            }
          }
          that.setData({
            verifiedItems: that.data.verifiedItems
          })
          if (that.data.verifiedItems.length == 0) {
            that.setData({
              nonew: '暂无申请记录'
            })
          }
          if (way == 'accept') {
            getApp().globalData.newmember = true
          }
          getApp().globalData.verifiedItems = that.data.verifiedItems
          that.setData({
            SubmitDisabled: true
          })
        }
        else {
          wx.showToast({
            title: '失败',
            image: '../../../../images/error.png'
          })
        }
      },
      fail: function (error) {
        wx.showToast({
          title: '网络异常',
          image: '../../../../images/network.png'
        })
      },
      complete: () => {
        this.setData({
          AcceptLoading: false,
          RefuseLoading: false
        })
      }
    })
  }

})