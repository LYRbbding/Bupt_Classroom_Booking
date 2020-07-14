// miniprogram/pages/Me/UserInfo/UserInfo/Me_Info_info.js
const classes = require('../../../../utils/classes-list.js')

Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
    dialogShow: false,
    showCheckNetworkDialog: false,
    OneButton: [{ text: '我知道了' }],
    schools: '单击此处选择',
    school_array: ['信息与通信工程学院', '电子工程学院', '计算机学院', '自动化学院', '软件学院', '数字媒体与设计艺术学院', '现代邮政学院', '网络空间安全学院', '光电信息学院', '经济管理学院', '人文学院', '理学院', '国际学院'],
    school_index: 0,
    grades: '单击此处选择',
    grade_array: ['2016级', '2017级', '2018级', '2019级'],
    grade_index: 0,
    classes: '单击此处选择',
    class_array: ['请先选择学院和年级后再选择班级'],
    class_index: 0,
    SubmitDisabled: true,
    SaveLoading: false
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    this.setData({
      schools: getApp().globalData.schools,
      grades: getApp().globalData.grades,
      classes: getApp().globalData.classes
    })
    for (var i = 0; i < this.data.school_array.length; i++) {
      if (this.data.school_array[i] == getApp().globalData.schools) {
        this.setData({ school_index: i })
      }
    }
    for (var i = 0; i < this.data.grade_array.length; i++) {
      if (this.data.grade_array[i] == getApp().globalData.grades) {
        this.setData({ grade_index: i })
      }
    }
    this.setData({ class_array: classes.class_multiarray[this.data.school_index][this.data.grade_index] })
  },

  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
      showCheckNetworkDialog: false,
    })
  },

  bindSchoolPickerChange: function (e) {
    this.setData({
      school_index: e.detail.value,
      schools: this.data.school_array[e.detail.value],
      classes: '单击此处选择'
    })
    if (this.data.grades != '单击此处选择') {
      this.setData({ class_array: classes.class_multiarray[this.data.school_index][this.data.grade_index] })
    }
    this.checkInfo()
  },
  bindGradePickerChange: function (e) {
    this.setData({
      grade_index: e.detail.value,
      grades: this.data.grade_array[e.detail.value],
      classes: '单击此处选择'
    })
    if (this.data.schools != '单击此处选择') {
      this.setData({ class_array: classes.class_multiarray[this.data.school_index][this.data.grade_index] })
    }
    this.checkInfo()
  },
  bindClassPickerChange: function (e) {
    this.setData({
      class_index: e.detail.value,
      classes: this.data.class_array[e.detail.value]
    })
    this.checkInfo()
  },
  checkInfo: function () {
    if ((this.data.schools == getApp().globalData.schools && this.data.grades == getApp().globalData.grades && this.data.classes == getApp().globalData.classes) || this.data.classes == '单击此处选择' || this.data.classes == '无') {
      this.setData({ SubmitDisabled: true })
    }
    else { this.setData({ SubmitDisabled: false }) }
  },

  UpdateInfo: function () {
    if (!this.data.SaveLoading) {
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
            info_schools: that.data.schools,
            info_grades: that.data.grades,
            info_classes: that.data.classes
          }
        },
        success: function (result) {
          getApp().globalData.schools = that.data.schools
          getApp().globalData.grades = that.data.grades
          getApp().globalData.classes = that.data.classes
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
          that.setData({ showCheckNetworkDialog: true })
        }
      })
    }
  },
  GoBack: function () {
    wx.navigateBack({ delta: 1 })
  }
})