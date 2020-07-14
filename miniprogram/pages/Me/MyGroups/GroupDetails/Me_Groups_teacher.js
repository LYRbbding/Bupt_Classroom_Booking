// miniprogram/pages/Me/MyGroups/GroupDetails/Me_Groups_teacher.js

Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
    navigationbar_loading: false,
    navigation_background: 'nav-color-default',
    button_color: '#7F7F7F',
    slideButtons: [{
      type: 'warn',
      text: '删除',
    }],
    teacherItems: [],
    nonew: '加载中',
    SubmitDisabled: true,
    AcceptLoading: false,
    RefuseLoading: false,
    verify_mem: [],
    buttons: [{ text: '取消' }, { text: '确定' }],
    dialogRemoveTeacherShow: false,
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
        method: 'checkteacher'
      },
      success: function (result) {
        if (result.result.teacher_lis != undefined) {
          that.setData({
            teacherItems: result.result.teacher_lis
          })
          if (result.result.teacher_lis.length == 0) {
            that.setData({
              nonew: '还未邀请' + (that.data.navigation_background == 'nav-color-red' ? '辅导员' : '指导教师')
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

  addTeacher(e) {
    wx.scanCode({
      scanType: 'qrCode',
      success: res => {
        this.setData({ navigationbar_loading: true })
        var qr_result = res.result
        if (qr_result.indexOf('BUPT_Classroom_Booking_Teacherid') != -1) {
          var teacher_id = qr_result.substring(qr_result.indexOf(':') + 1)
          this.manageTeacher('add', teacher_id)
          console.log(teacher_id)
        }
        else if (qr_result.indexOf('BUPT_Classroom_Booking') != -1) {
          wx.showToast({
            title: '非教师二维码',
            image: '../../../../images/wrongqrcode.png'
          })
        }
        else {
          wx.showToast({
            title: '无效的二维码',
            image: '../../../../images/wrongqrcode.png'
          })
        }
      },
      complete: res => {
        this.setData({ navigationbar_loading: false })
      }
    })
  },

  removeTeacher(e) {
    console.log(e)
    this.setData({
      name_temp: this.data.teacherItems[Number(e.currentTarget.dataset.idx)].realname,
      dialogRemoveTeacherShow: true
    })
    this.data.openid_temp = e.currentTarget.dataset.openid
  },

  tapDialogRemoveTeacherButton(e) {
    if (e.detail.index == 1) {
      this.manageTeacher('remove', this.data.openid_temp)
    }
    this.setData({
      dialogRemoveTeacherShow: false
    })
  },

  manageTeacher(method, openid) {
    wx.showLoading({
      title: '操作中',
    })
    wx.cloud.callFunction({
      name: 'SearchGroupsMembers',
      data: {
        id: this.data.group_id,
        method: 'manageteacher',
        content: method,
        person: openid
      },
      success: result => {
        wx.hideLoading()
        this.data.name_temp = ''
        this.data.openid_temp = ''
        if (result.result.status == 'Success') {
          wx.showToast({
            title: (method == 'add' ? '邀请' : '删除') + '成功',
            icon: 'success'
          })
        }
        else {
          wx.showToast({
            title: (method == 'add' ? '邀请' : '删除') + '失败',
            icon: '../../../../images/error.png'
          })
        }
      },
      fail: error => {
        wx.showToast({
          title: '网络异常',
          image: '../../../../images/network.png'
        })
      },
    })
  }

})