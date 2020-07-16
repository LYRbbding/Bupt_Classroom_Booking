// miniprogram/pages/Me/IdentityAuthentication/Authorize/Me_Auth_auth.js
const classes = require('../../../../utils/classes-list.js')

Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
    dialogShow: false,
    showTeacherCheckedFailDialog: false,
    showIllegalDialog: false,
    showCheckNetworkDialog: false,
    OneButton: [{
      text: '我知道了'
    }],
    uid: '',
    realname: '',
    schools: '单击此处选择',
    school_array: ['信息与通信工程学院', '电子工程学院', '计算机学院', '自动化学院', '软件学院', '数字媒体与设计艺术学院', '现代邮政学院', '网络空间安全学院', '光电信息学院', '经济管理学院', '人文学院', '理学院', '国际学院'],
    school_index: 0,
    grades: '单击此处选择',
    grade_array: ['2016级', '2017级', '2018级', '2019级'],
    grade_index: 0,
    classes: '单击此处选择',
    class_array: ['请先选择学院和年级后再选择班级'],
    class_index: 0,
    department: '',
    post: '',
    phonenumber: '',
    mailbox: '',
    qqid: '',
    wxid: '',
    marginT: 10,
    weui_h: "weui-article__h1",
    role_items: [{
      name: 'Student',
      value: '学生　　　',
      checked: 'true'
    },
    {
      name: 'Teacher',
      value: '辅导员/教师'
    },
    ],
    haveInfo: false,
    teacherEnabled: false,
    teacherChecked: 0,
    AuthDisabled: false,
    SubmitDisabled: true,
    AuthLoading: false,
    formData: {

    },
    rules: [{
      name: 'mobile',
      rules: [{
        mobile: true,
        message: '*无效的手机号'
      }],
    }, {
      name: 'email',
      rules: {
        email: true,
        message: '*无效的邮箱格式'
      },
    }]
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    /*************
     * 页面自适应显示
     *************/
    if (wx.getSystemInfoSync().windowHeight > 700) {
      this.setData({
        marginT: 15
      })
    } else if (wx.getSystemInfoSync().windowHeight < 600) {
      this.setData({
        marginT: 5,
        weui_h: "weui-article__h2"
      })
    }
    /*************
     * 获取用户信息
     *************/
    var uid = wx.getStorageSync('uid')
    var realname = wx.getStorageSync('realname')
    var brief = wx.getStorageSync('briefInfo')
    if (uid == undefined || uid == '') {
      uid = brief.uid
    }
    if (realname == undefined || realname == '') {
      realname = brief.realname
    }
    this.setData({
      uid: uid,
      realname: realname
    })
    const db = wx.cloud.database()
    db.collection('StudentInfo').where({
      __uid: this.data.uid
    }).get().then(res => {
      console.log(res)
      if (res.data[0] != undefined && res.data[0]._openid != undefined && res.data[0]._openid != '') {
        wx.showToast({
          title: '用户已认证',
        })
        this.setData({
          AuthDisabled: true
        })
      }
      if (res.data[0] != undefined && res.data[0].info_schools != undefined && res.data[0].info_schools != '' && res.data[0].info_grades != undefined && res.data[0].info_grades != '' && res.data[0].info_classes != undefined && res.data[0].info_classes != '') {
        this.setData({
          schools: res.data[0].info_schools,
          grades: res.data[0].info_grades,
          classes: res.data[0].info_classes,
          haveInfo: true,
        })
        wx.hideLoading()
      }
    }).catch(err => {
      wx.hideLoading()
    })
  },

  /*************************
   * 对话框区
   * 关闭提示对话框
   *************************/
  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
      showTeacherCheckedFailDialog: false,
      showIllegalDialog: false,
      showCheckNetworkDialog: false,
    })
  },

  /*************************
   * 选择器区
   * 用户填写个人信息
   *************************/
  bindSchoolPickerChange: function (e) {
    this.setData({
      school_index: e.detail.value,
      schools: this.data.school_array[e.detail.value],
      classes: '单击此处选择'
    })
    if (this.data.grades != '单击此处选择') {
      this.setData({
        class_array: classes.class_multiarray[this.data.school_index][this.data.grade_index]
      })
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
      this.setData({
        class_array: classes.class_multiarray[this.data.school_index][this.data.grade_index]
      })
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
    if ((this.data.teacherChecked <= 0 || this.data.teacherEnabled == false) && (this.data.schools == '单击此处选择' || this.data.grades == '单击此处选择' || this.data.classes == '单击此处选择' || this.data.classes == '无')) {
      this.setData({
        SubmitDisabled: true
      })
    } else {
      this.setData({
        SubmitDisabled: false
      })
    }
  },

  /*************************
   * 输入框区
   * 用户填写个人信息
   *************************/
  phonenumber: function (e) {
    this.setData({
      [`formData.mobile`]: e.detail.value
    })
    this.setData({
      phonenumber: e.detail.value
    })
  },
  mailbox: function (e) {
    this.setData({
      [`formData.email`]: e.detail.value
    })
    this.setData({
      mailbox: e.detail.value
    })
  },
  qqid: function (e) {
    this.setData({
      qqid: e.detail.value
    })
  },
  wxid: function (e) {
    this.setData({
      wxid: e.detail.value
    })
  },

  /*************************
   * 单选框区
   * 用户选择个人身份
   *************************/
  radioChange: function (e) {
    var that = this
    if (e.detail.value == 'Teacher') {
      wx.showLoading({
        title: '身份校验中',
        mask: true
      })
      this.setData({
        teacherEnabled: true
      })
      if (this.data.teacherChecked > 0) {
        wx.hideLoading()
        wx.showToast({
          title: '校验成功',
          icon: 'success',
          duration: 2000,
          mask: false
        })
        that.checkInfo()
      } else if (this.data.teacherChecked < 0) {
        wx.hideLoading()
        that.setData({
          role_items: [{
            name: 'Student',
            value: '学生　　　',
            checked: 'true'
          },
          {
            name: 'Teacher',
            value: '辅导员/教师'
          },
          ],
          showTeacherCheckedFailDialog: true,
          teacherEnabled: false,
          teacherChecked: that.data.teacherChecked - 1
        })
        that.checkInfo()
      } else {
        const db = wx.cloud.database()
        db.collection('TeacherInfo').where({
          __uid: this.data.uid,
          __realname: this.data.realname
        }).get().then(res => {
          wx.hideLoading()
          if (res.data[0] != undefined && res.data[0].__uid == that.data.uid && res.data[0].__realname == that.data.realname) {
            wx.showToast({
              title: '校验成功',
              icon: 'success',
              duration: 2000,
              mask: false
            })
            that.setData({
              department: res.data[0].department,
              post: res.data[0].post,
              teacherChecked: that.data.teacherChecked + 1
            })
          } else {
            that.setData({
              role_items: [{
                name: 'Student',
                value: '学生　　　',
                checked: 'true'
              },
              {
                name: 'Teacher',
                value: '辅导员/教师'
              },
              ],
              showTeacherCheckedFailDialog: true,
              teacherEnabled: false,
              teacherChecked: that.data.teacherChecked - 1
            })
          }
          that.checkInfo()
        }).catch(err => {
          that.setData({
            role_items: [{
              name: 'Student',
              value: '学生　　　',
              checked: 'true'
            },
            {
              name: 'Teacher',
              value: '辅导员/教师'
            },
            ],
            showTeacherCheckedFailDialog: true,
            teacherEnabled: false,
            teacherChecked: that.data.teacherChecked - 1
          })
        })
      }
    } else {
      this.setData({
        teacherEnabled: false
      })
      this.checkInfo()
    }
  },

  /*************************
   * 按钮区
   * 用户提交验证
   *************************/
  GoToAuth: function () {
    if (!this.data.AuthLoading) {
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
            } else {
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
            AuthLoading: true
          })
          const db = wx.cloud.database()
          var that = this
          if (this.data.teacherEnabled) {
            /*****************
             * 判断教师用户是否具有相应授权
             *****************/
            db.collection('TeacherInfo').where({
              __uid: this.data.uid,
              __realname: this.data.realname
            }).count().then(res => {
              if (res.total != 0) {
                db.collection('UserRelationship').where({
                  _openid: getApp().globalData.openid
                }).count().then(result => {
                  var TeacherData = {
                    _openid: getApp().globalData.openid,
                    uid: that.data.uid,
                    realname: that.data.realname,
                    identity: 'teacher',
                    department: that.data.department,
                    post: that.data.post
                  }
                  if (result.total != 0) {
                    wx.cloud.callFunction({
                      name: 'UpdateDatabase',
                      data: {
                        collection: 'UserRelationship',
                        place: {
                          _openid: getApp().globalData.openid
                        },
                        data: TeacherData
                      },
                      success: that.TeacherSuccessHandler(),
                      fail: function (err) {
                        that.setData({
                          showCheckNetworkDialog: true,
                          AuthLoading: false
                        })
                      }
                    })
                  } else {
                    db.collection('UserRelationship').add({
                      data: TeacherData,
                      success: that.TeacherSuccessHandler(),
                      fail: function (err) {
                        that.setData({
                          showCheckNetworkDialog: true,
                          AuthLoading: false
                        })
                      }
                    })
                  }
                }).catch(error => { that.setData({ showCheckNetworkDialog: true, AuthLoading: false }) })
              } else { that.setData({ showIllegalDialog: true, AuthLoading: false }) }
            }).catch(error => { that.setData({ showCheckNetworkDialog: true, AuthLoading: false }) })
          } else {
            /*****************
             * 判断学生用户相应信息
             *****************/
            db.collection('UserRelationship').where({
              _openid: getApp().globalData.openid
            }).count().then(res => {
              db.collection('StudentInfo').where({
                __uid: this.data.uid,
                __realname: this.data.realname
              }).count().then(re => {
                var StudentData = {
                  _openid: getApp().globalData.openid,
                  contacts_phonenumber: that.data.phonenumber,
                  contacts_mailbox: that.data.mailbox,
                  contacts_qqid: that.data.qqid,
                  contacts_wxid: that.data.wxid
                }
                if (!that.data.haveInfo) {
                  StudentData.__uid = that.data.uid
                  StudentData.__realname = that.data.realname
                  StudentData.info_schools = that.data.schools
                  StudentData.info_grades = that.data.grades
                  StudentData.info_classes = that.data.classes
                }
                if (re.total != 0) {
                  wx.cloud.callFunction({
                    name: 'UpdateDatabase',
                    data: {
                      collection: 'StudentInfo',
                      place: {
                        __uid: that.data.uid,
                        __realname: that.data.realname
                      },
                      data: StudentData
                    },
                    fail: function (err) {
                      that.setData({
                        showCheckNetworkDialog: true,
                        AuthLoading: false
                      })
                    }
                  })
                } else {
                  StudentData.__uid = that.data.uid
                  StudentData.__realname = that.data.realname
                  StudentData.info_schools = that.data.schools
                  StudentData.info_grades = that.data.grades
                  StudentData.info_classes = that.data.classes
                  db.collection('StudentInfo').add({
                    data: StudentData,
                    fail: function (err) {
                      that.setData({
                        showCheckNetworkDialog: true,
                        AuthLoading: false
                      })
                    }
                  })
                }
              }).catch(error => {
                that.setData({
                  showCheckNetworkDialog: true,
                  AuthLoading: false
                })
              })
              getApp().globalData.schools = that.data.schools
              getApp().globalData.grades = that.data.grades
              getApp().globalData.classes = that.data.classes
              getApp().globalData.phonenumber = that.data.phonenumber
              getApp().globalData.mailbox = that.data.mailbox
              getApp().globalData.qqid = that.data.qqid
              getApp().globalData.wxid = that.data.wxid
              wx.setStorage({
                key: 'detailedInfo',
                data: {
                  schools: that.data.schools,
                  grades: that.data.grades,
                  classes: that.data.classes,
                  phonenumber: that.data.phonenumber,
                  mailbox: that.data.mailbox,
                  qqid: that.data.qqid,
                  wxid: that.data.wxid
                }
              })
              var StudentUserData = {
                _openid: getApp().globalData.openid,
                uid: that.data.uid,
                realname: that.data.realname,
                identity: 'student',
                department: that.data.schools
              }
              if (res.total != 0) {
                wx.cloud.callFunction({
                  name: 'UpdateDatabase',
                  data: {
                    collection: 'UserRelationship',
                    place: {
                      _openid: getApp().globalData.openid
                    },
                    data: StudentUserData
                  },
                  success: that.StudentSuccessHandler(),
                  fail: function (err) {
                    that.setData({
                      showCheckNetworkDialog: true,
                      AuthLoading: false
                    })
                  }
                })
              } else {
                db.collection('UserRelationship').add({
                  data: StudentUserData,
                  success: that.StudentSuccessHandler(),
                  fail: function (err) {
                    that.setData({
                      showCheckNetworkDialog: true,
                      AuthLoading: false
                    })
                  }
                })
              }
            }).catch(error => {
              that.setData({
                showCheckNetworkDialog: true,
                AuthLoading: false
              })
            })
          }
        }
      })
    }
  },

  TeacherSuccessHandler() {
    wx.setStorage({
      key: 'briefInfo',
      data: {
        uid: this.data.uid,
        realname: this.data.realname,
        identity: 'teacher',
        department: this.data.department,
        post: this.data.post
      }
    })
    getApp().globalData.uid = this.data.uid
    getApp().globalData.realname = this.data.realname
    getApp().globalData.identity = 'teacher'
    getApp().globalData.department = this.data.department
    getApp().globalData.post = this.data.post
    wx.showToast({
      title: '成功',
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 3
      })
    }, 1500)
    this.setData({
      AuthLoading: false
    })
  },

  StudentSuccessHandler() {
    wx.setStorage({
      key: 'briefInfo',
      data: {
        uid: this.data.uid,
        realname: this.data.realname,
        identity: 'student',
        department: this.data.department
      }
    })
    getApp().globalData.uid = this.data.uid
    getApp().globalData.realname = this.data.realname
    getApp().globalData.identity = 'student'
    getApp().globalData.department = this.data.schools
    console.log('success')
    wx.showToast({
      title: '成功',
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 3
      })
    }, 1500)
    this.setData({
      AuthLoading: false
    })
  },

  ResetInput: function () {
    if (!this.data.haveInfo) {
      this.setData({
        schools: '单击此处选择',
        school_index: 0,
        grades: '单击此处选择',
        grade_index: 0,
        classes: '单击此处选择',
        class_array: ['请先选择学院和年级后再选择班级'],
        class_index: 0,
      })
    }
    this.setData({
      role_items: [{
        name: 'Student',
        value: '学生　　　',
        checked: 'true'
      },
      {
        name: 'Teacher',
        value: '辅导员/教师'
      },
      ],
      phonenumber: '',
      mailbox: '',
      qqid: '',
      wxid: '',
      SubmitDisabled: true,
      teacherEnabled: false
    })
  },
  GoBack: function () {
    wx.navigateBack({
      delta: 1
    })
  }

})