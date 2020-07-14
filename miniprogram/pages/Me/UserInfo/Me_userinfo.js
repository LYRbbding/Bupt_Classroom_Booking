// miniprogram/pages/Me/UserInfo/Me_userinfo.js
const QR = require('../../../utils/weapp-qrcode.js')

Page({

  //页面的初始数据
  data: {
    PCmode: false,
    navigationbar_show: false,
    navigation_loading: false,
    uid: '',
    realname: '',
    schools: '',
    grades: '',
    classes: '',
    department: '',
    post: '',
    phonenumber: '',
    mailbox: '',
    qqid: '',
    wxid: '',
    profile_photo: '../../../images/Me/default_profile_photo.jpg',
    userInfo_url: '',
    contacts_url: '',
    success: '',
    success_status: false
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    if (getApp().globalData.systemPlatform.indexOf('macOS') != -1 || getApp().globalData.systemPlatform.indexOf('Windows') != -1 || getApp().globalData.systemPlatform.indexOf('win') != -1) {
      this.data.PCmode = true
    }
    this.setData({
      PCmode: this.data.PCmode,
      margin: Math.round((wx.getSystemInfoSync().windowWidth - 320) / 2),
      padding: Math.round((wx.getSystemInfoSync().windowHeight - 500) / 2)
    })
    const db = wx.cloud.database()
    var that = this
    if (getApp().globalData.avatarUrl == undefined) {
      wx.getSetting({
        success: function (res) {
          for (var i in res.authSetting) {
            if (i == 'scope.userInfo') {
              var status = res.authSetting[i]
            }
          }
          if (status == true) {
            wx.getUserInfo({
              success: function (res) {
                var userInfo = res.userInfo
                var avatarUrl = userInfo.avatarUrl.slice(0, -3) + '0'
                that.setData({ profile_photo: avatarUrl })
                getApp().globalData.avatarUrl = avatarUrl
              }
            })
          }
        }
      })
    } else {
      this.setData({ profile_photo: getApp().globalData.avatarUrl })
    }
    if (getApp().globalData.identity == 'student') {
      wx.getStorage({
        key: 'detailedInfo',
        success: function (re) {
          that.setData({
            _id: re.data._id,
            schools: re.data.schools,
            grades: re.data.grades,
            classes: re.data.classes,
            phonenumber: re.data.phonenumber,
            mailbox: re.data.mailbox,
            qqid: re.data.qqid,
            wxid: re.data.wxid,
          })
          that.data.userInfo_url = 'UserInfo/Me_Info_info'
          that.data.contacts_url = 'Contacts/Me_Info_con'
          getApp().globalData.schools = re.data.schools
          getApp().globalData.grades = re.data.grades
          getApp().globalData.classes = re.data.classes
          getApp().globalData.phonenumber = re.data.phonenumber
          getApp().globalData.mailbox = re.data.mailbox
          getApp().globalData.qqid = re.data.qqid
          getApp().globalData.wxid = re.data.wxid
        },
        complete: function (re) {
          db.collection('StudentInfo').where({
            _openid: getApp().globalData.openid
          }).get().then(res => {
            that.setData({
              _id: res.data[0]._id,
              schools: res.data[0].info_schools,
              grades: res.data[0].info_grades,
              classes: res.data[0].info_classes,
              phonenumber: res.data[0].contacts_phonenumber,
              mailbox: res.data[0].contacts_mailbox,
              qqid: res.data[0].contacts_qqid,
              wxid: res.data[0].contacts_wxid,
            })
            wx.setStorage({
              key: 'detailedInfo',
              data: {
                _id: res.data[0]._id,
                schools: res.data[0].info_schools,
                grades: res.data[0].info_grades,
                classes: res.data[0].info_classes,
                phonenumber: res.data[0].contacts_phonenumber,
                mailbox: res.data[0].contacts_mailbox,
                qqid: res.data[0].contacts_qqid,
                wxid: res.data[0].contacts_wxid,
              },
            })
            that.data.userInfo_url = 'UserInfo/Me_Info_info'
            that.data.contacts_url = 'Contacts/Me_Info_con'
            getApp().globalData.schools = res.data[0].info_schools
            getApp().globalData.grades = res.data[0].info_grades
            getApp().globalData.classes = res.data[0].info_classes
            getApp().globalData.phonenumber = res.data[0].contacts_phonenumber
            getApp().globalData.mailbox = res.data[0].contacts_mailbox
            getApp().globalData.qqid = res.data[0].contacts_qqid
            getApp().globalData.wxid = res.data[0].contacts_wxid
          }).catch(err => {
            wx.showToast({
              title: '网络异常',
              image: '../../../images/error.png'
            })
          })
        }
      })
    }
    else {
      wx.getStorage({
        key: 'teacherInfo',
        success: function (re) {
          that.setData({
            _id: re.data._id,
          })
        },
        fail: function (re) {
          db.collection('StudentInfo').where({
            _openid: getApp().globalData.openid
          }).get().then(res => {
            that.setData({
              _id: res.data[0]._id,
            })
            wx.setStorage({
              key: 'teacherInfo',
              data: {
                _id: res.data[0]._id,
              },
            })
          }).catch(err => {
            wx.showToast({
              title: '网络异常',
              image: '../../../images/error.png'
            })
          })
        }
      })
    }
    this.setData({
      uid: getApp().globalData.uid,
      realname: getApp().globalData.realname,
      identity: getApp().globalData.identity,
      post: getApp().globalData.post
    })
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function () { },
  //生命周期函数--监听页面显示
  onShow: function () {
    const app = getApp().globalData
    const that = this.data
    if (app.schools != that.schools && app.schools != undefined) {
      this.setData({ schools: app.schools })
    }
    if (app.grades != that.grades && app.grades != undefined) {
      this.setData({ grades: app.grades })
    }
    if (app.classes != that.classes && app.classes != undefined) {
      this.setData({ classes: app.classes })
    }
    if (app.phonenumber != that.phonenumber && app.phonenumber != undefined) {
      this.setData({ phonenumber: app.phonenumber })
    }
    if (app.mailbox != that.mailbox && app.mailbox != undefined) {
      this.setData({ mailbox: app.mailbox })
    }
    if (app.qqid != that.qqid && app.qqid != undefined) {
      this.setData({ qqid: app.qqid })
    }
    if (app.wxid != that.wxid && app.wxid != undefined) {
      this.setData({ wxid: app.wxid })
    }
    var that2 = this
    if (getApp().globalData.avatarUrl == undefined) {
      wx.getSetting({
        success: function (res) {
          for (var i in res.authSetting) {
            if (i == 'scope.userInfo') {
              var status = res.authSetting[i]
            }
          }
          if (status == true) {
            wx.getUserInfo({
              success: function (res) {
                var userInfo = res.userInfo
                var avatarUrl = userInfo.avatarUrl.slice(0, -3) + '0'
                that2.setData({ profile_photo: avatarUrl })
                getApp().globalData.avatarUrl = avatarUrl
              }
            })
          }
        }
      })
    } else {
      this.setData({ profile_photo: getApp().globalData.avatarUrl })
    }
  },

  photo: function () {
    var that = this
    this.setData({ navigation_loading: true })
    wx.getSetting({
      success: function (res) {
        for (var i in res.authSetting) {
          if (i == 'scope.userInfo') {
            var status = res.authSetting[i]
          }
        }
        if (status == true) {
          wx.getUserInfo({
            success: function (res) {
              var userInfo = res.userInfo
              var avatarUrl = userInfo.avatarUrl.slice(0, -3) + '0'
              that.setData({
                success: '已同步微信头像',
                success_status: true,
                profile_photo: avatarUrl
              })
            }
          })
        }
        else {
          wx.navigateTo({
            url: './Avatar/Me_Info_ava',
          })
        }
        that.setData({ navigation_loading: false })
      }
    })
  },

  userInfo: function () {
    wx.navigateTo({
      url: this.data.userInfo_url,
    })
  },

  contacts: function () {
    wx.navigateTo({
      url: this.data.contacts_url,
    })
  },

  qrcode: function () {
    var imgData = QR.drawImg('BUPT_Classroom_Booking_Teacherid:' + this.data._id, {
      typeNumber: 4,
      errorCorrectLevel: 'H',
      size: 288
    })
    this.setData({
      mask: true,
      mask_shown: true,
      qrCodeImg: imgData
    })
  },
  HideMask: function () {
    this.setData({
      mask_shown: false,
    })
    var that = this
    setTimeout(function () {
      that.setData({ mask: false })
    }, 300)
  },

})