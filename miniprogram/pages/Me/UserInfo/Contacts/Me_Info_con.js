// miniprogram/pages/Me/UserInfo/Contacts/Me_Info_Con.js
Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
    dialogShow: false,
    showCheckNetworkDialog: false,
    OneButton: [{ text: '我知道了' }],
    phonenumber: '',
    mailbox: '',
    qqid: '',
    wxid: '',
    SubmitDisabled: true,
    SaveLoading: false,
    formData: {

    },
    rules: [{
      name: 'mobile',
      rules: [{ mobile: true, message: '*无效的手机号' }],
    }, {
      name: 'email',
      rules: { email: true, message: '*无效的邮箱格式' },
    }]
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    this.setData({
      phonenumber: getApp().globalData.phonenumber,
      mailbox: getApp().globalData.mailbox,
      qqid: getApp().globalData.qqid,
      wxid: getApp().globalData.wxid
    })
  },

  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
      showCheckNetworkDialog: false,
    })
  },

  phonenumber: function (e) {
    this.setData({
      [`formData.mobile`]: e.detail.value
    })
    this.setData({ phonenumber: e.detail.value })
    this.checkInfo()
  },
  mailbox: function (e) {
    this.setData({
      [`formData.email`]: e.detail.value
    })
    this.setData({ mailbox: e.detail.value })
    this.checkInfo()
  },
  qqid: function (e) {
    this.setData({ qqid: e.detail.value })
    this.checkInfo()
  },
  wxid: function (e) {
    this.setData({ wxid: e.detail.value })
    this.checkInfo()
  },
  checkInfo: function () {
    if (this.data.phonenumber == getApp().globalData.phonenumber && this.data.mailbox == getApp().globalData.mailbox && this.data.qqid == getApp().globalData.qqid && this.data.wxid == getApp().globalData.wxid) {
      this.setData({ SubmitDisabled: true })
    }
    else { this.setData({ SubmitDisabled: false }) }
    var rules = []
  },

  UpdateInfo: function () {
    if (!this.data.SaveLoading) {
      this.selectComponent('#form').validate((valid, errors) => {
        console.log('valid', valid, errors)
        if (!valid) {
          const firstError = Object.keys(errors)
          while (firstError.length) {
            if (errors[firstError[0]].message == '*无效的手机号' && this.data.phonenumber != "" && this.data.phonenumber != undefined || errors[firstError[0]].message == '*无效的邮箱格式' && this.data.mailbox != "" && this.data.mailbox != undefined) {
              this.setData({
                error: errors[firstError[0]].message
              })
              break;
            }
            else {
              this.setData({
                error: ""
              })
              firstError.splice(0, 1)
            }
          }
          if (firstError.length == 0) {
            valid = true
          }
        }
        if (valid) {
          this.setData({
            error: ""
          })
          this.setData({ SaveLoading: true })
          var that = this
          wx.cloud.callFunction({
            name: 'UpdateUserRelationship',
            data: {
              collection: 'StudentInfo',
              place: {
                _openid: getApp().globalData.openid
              },
              data: {
                contacts_phonenumber: that.data.phonenumber,
                contacts_mailbox: that.data.mailbox,
                contacts_qqid: that.data.qqid,
                contacts_wxid: that.data.wxid,
              }
            },
            success: function (result) {
              getApp().globalData.phonenumber = that.data.phonenumber
              getApp().globalData.mailbox = that.data.mailbox
              getApp().globalData.qqid = that.data.qqid
              getApp().globalData.wxid = that.data.wxid
              wx.setStorage({
                key: 'detailedInfo',
                data: {
                  schools: getApp().globalData.schools,
                  grades: getApp().globalData.grades,
                  classes: getApp().globalData.classes,
                  phonenumber: getApp().globalData.phonenumber,
                  mailbox: getApp().globalData.mailbox,
                  qqid: getApp().globalData.qqid,
                  wxid: getApp().globalData.wxid
                },
              })
              wx.navigateBack({ delta: 1 })
              that.setData({ SaveLoading: false })
              console.log(result)
            },
            fail: function () {
              that.setData({ SaveLoading: false, showCheckNetworkDialog: true })
            }
          })
        }
      })
    }
  },
  GoBack: function () {
    wx.navigateBack({ delta: 1 })
  }
})