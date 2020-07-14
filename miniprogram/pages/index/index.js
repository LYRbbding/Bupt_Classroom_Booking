// miniprogram/pages/index/index.js

const db = wx.cloud.database()

Page({

  //页面的初始数据
  data: {
    PCmode: false,
    /*************************
     * 
     *      导航区
     * 
     *************************/
    current: 0,
    list: [{
      "text": "活动",
      "iconPath": "../../images/todos.png",
      "selectedIconPath": "../../images/todos_HL.png",
      //badge: '1'
    }, {
      "text": "查询",
      "iconPath": "../../images/query.png",
      "selectedIconPath": "../../images/query_HL.png"
    }, {
      "text": "我",
      "iconPath": "../../images/me.png",
      "selectedIconPath": "../../images/me_HL.png",
      dot: false
    }],
    navigationbar_show: false,
    background: true,
    title: '邮教有约',
    /*************************
     * 
     *      我
     * 
     *************************/
    profile_photo: '../../images/Me/default_profile_photo.jpg',
    infourl: '',
    groupurl: '',
    messagesurl: '',
    historyurl: '',
    name: '加载中',
    description: '请稍后……',
    uid: '',
    realname: '',
    identity: '',
    department: '',
    me_max_width: 0,
    qrcode: '',
    navigationLoading: false,
    showLoading: true,
    invitation_available: true,
    inv_count: 0,
    pass_count: 0,
    wait_count: 0,
    fail_count: 0,
    subscription_status: false,
    verification_status: false,
    arrowAccept: false,
    arrowWaiting: false,
    arrowFinish: false,
    countAccept: 0,
    countWaiting: 0,
    countFinish: 0,
    welcome: true,
    school_choice: ['沙河校区', '校本部'],
    building_choice: [['教学实验综合楼北楼', '教学实验综合楼南楼', '电路中心实验楼', '综合办公楼', '图书馆'], ['主楼', '教一楼', '教二楼', '教三楼', '教四楼', '经管楼', '外训楼', '新科研楼']],
    classroom_choice: [
      [
        [
          [['一层', '二层', '三层', '四层', '五层', '地下一层'], ['N103', 'N104', 'N105', 'N108', 'N110', 'N111', 'N113', 'N116', 'N118', 'N119']],
          [['一层', '二层', '三层', '四层', '五层', '地下一层'], ['N201', 'N206', 'N207', 'N208', 'N209', 'N214', 'N215', 'N216']],
          [['一层', '二层', '三层', '四层', '五层', '地下一层'], ['N301', 'N302', 'N307', 'N308', 'N309', 'N310', 'N315', 'N318', 'N319', 'N327', 'N328', 'N330']],
          [['一层', '二层', '三层', '四层', '五层', '地下一层'], ['N403', 'N404', 'N405', 'N406', 'N411', 'N412', 'N414', 'N415', 'N420', 'N423', 'N424', 'N426']],
          [['一层', '二层', '三层', '四层', '五层', '地下一层'], ['N506', 'N512', 'N519', 'N520', 'N524', 'N526']],
          [['一层', '二层', '三层', '四层', '五层', '地下一层'], ['D-N14']]
        ],
        [
          [['一层', '二层', '三层', '四层', '五层', '地下一层'], ['S103', 'S104', 'S106', 'S107', 'S109', 'S112', 'S113', 'S114', 'S118', 'S119']],
          [['一层', '二层', '三层', '四层', '五层', '地下一层'], ['S202', 'S205', 'S207', 'S208', 'S210', 'S211', 'S215', 'S216']],
          [['一层', '二层', '三层', '四层', '五层', '地下一层'], ['S301', 'S302', 'S307', 'S308', 'S310', 'S315', 'S318', 'S319', 'S323', 'S327']],
          [['一层', '二层', '三层', '四层', '五层', '地下一层'], ['S403', 'S404', 'S405', 'S406', 'S411', 'S412', 'S414', 'S415', 'S418', 'S419', 'S422', 'S423']],
          [['一层', '二层', '三层', '四层', '五层', '地下一层'], ['S503', 'S504', 'S505', 'S506', 'S509', 'S511', 'S512', 'S514', 'S518', 'S519', 'S522', 'S523']],
          [['一层', '二层', '三层', '四层', '五层', '地下一层'], ['D-S05', 'D-S06', 'D-S08', 'D-S10', 'D-S11', 'D-S12', 'D-S16', 'D-S20']]
        ],
        ['电路中心01', '电路中心02', '电路中心03', '电路中心04'],
        ['办-一层多功能厅', '办-二层多功能厅'],
        ['图-105', '图-107', '图-108']
      ],
      [
        ['主-103', '主-1101', '主-1103', '主-1112', '主-113', '主-119', '主-1401', '主-1419', '主-209', '主-421', '主-501', '主-503'],
        ['1-101', '1-202', '1-301', '1-428'],
        ['2-101A', '2-201', '2-240', '2-301', '2-313', '2-317', '2-339', '2-401', '2-435', '2-437', '2-441', '2-502'],
        [
          [['一层', '二层', '三层', '四层', '五层'], ['3-108']],
          [['一层', '二层', '三层', '四层', '五层'], ['3-205', '3-208', '3-211', '3-217']],
          [['一层', '二层', '三层', '四层', '五层'], ['3-305', '3-308', '3-311', '3-317', '3-326', '3-328', '3-333', '3-335', '3-337', '3-339']],
          [['一层', '二层', '三层', '四层', '五层'], ['3-405', '3-408', '3-411', '3-417', '3-426', '3-428', '3-433', '3-435', '3-437']],
          [['一层', '二层', '三层', '四层', '五层'], ['3-519', '3-535', '3-537', '3-539', '3-540', '3-546']]
        ],
        [
          [['一层', '二层', '三层', '四层'], ['4-115', '4-116', '4-121', '4-123', '4-127', '4-138']],
          [['一层', '二层', '三层', '四层'], ['4-202', '4-203', '4-226', '4-230', '4-231', '4-238']],
          [['一层', '二层', '三层', '四层'], ['4-302', '4-303', '4-313', '4-318', '4-340']],
          [['一层', '二层', '三层', '四层'], ['4-401', '4-402', '4-410', '4-412', '4-422', '4-441', '4-443', '4-444']]
        ],
        ['经管楼-102', '经管楼-106', '经管楼-225'],
        ['外训楼-301'],
        ['新科研-106', '新科研-110', '新科研-116', '新科研-120', '新科研-343']
      ]
    ],
    time_array: ["第01节 08:00-08:45", "第02节 08:50-09:35", "第03节 09:50-10:35", "第04节 10:40-11:25", "第05节 11:30-12:15", "第06节 13:00-13:45", "第07节 13:50-14:35", "第08节 14:45-15:30", "第09节 15:40-16:25", "第10节 16:35-17:20", "第11节 17:25-18:10", "第12节 18:30-19:15", "第13节 19:20-20:05", "第14节 20:10-20:55"],
    school_building_index: [0, 0],
    school_building_value: '沙河校区 教学实验综合楼北楼',
    classroom_multi_index: [0, 0],
    classroom_single_index: 0,
    classroom_value: 'N103',
    classroom_multi: true,
    sectionS_index: 0,
    sectionE_index: 0,
    sectionS_value: '单击此处选择',
    sectionE_value: '单击此处选择',
    DateS_value: '单击此处选择',
    DateE_value: '单击此处选择',
    time_footer: '',
    time_footer_text: '请选择时间'
  },

  //生命周期函数--监听页面加载
  onLoad: function (query) {
    this.setData({
      school_building_array: [this.data.school_choice, this.data.building_choice[0]],
      classroom_multi_array: this.data.classroom_choice[0][0][0]
    })
    if (this.compareVersion(wx.getSystemInfoSync().SDKVersion, '2.10.1') < 0) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，建议您升级到最新版本微信后使用。'
      })
    }
    var that = this
    wx.getSystemInfo({
      success(res) {
        that.data.platform = res.platform
        getApp().globalData.systemPlatform = res.system
        if (wx.setWindowSize) {
          wx.setWindowSize({
            width: Math.round(res.screenWidth * 0.75),
            height: Math.round(res.screenHeight * 0.75)
          })
        }
        if (getApp().globalData.systemPlatform.indexOf('macOS') != -1 || getApp().globalData.systemPlatform.indexOf('Windows') != -1 || getApp().globalData.systemPlatform.indexOf('win') != -1) {
          that.setData({
            PCmode: true
          })
        }
      }
    })
    /*console.log(query)
    const scene = decodeURIComponent(query.scene)
    console.log('scene', scene)
    if (scene !== 'undefined') {
      console.log('scene', scene)
    }
    var that = this
    /*wx.cloud.callFunction({
      name: 'GetQRCode',
      data: {
        scene: 'qwerty'
      },
      success: res => {
        that.setData({
          qrcode: 'data:image/jpeg;base64,' + wx.arrayBufferToBase64(res.result.buffer.data)
        })
        console.log(res.result.buffer)
        console.log('QR:'+'data:image/jpeg;base64,'+ wx.arrayBufferToBase64(res.result.buffer.data))
      }
    })*/
    /*wx.getStorageInfo({
      success(res) {
        console.log(res.keys, 'Storage:', res.currentSize + '/' + res.limitSize, (res.currentSize/res.limitSize*100).toFixed(2)+"%")
      }
    })*/
    /*************************
     * 
     *      我
     * 
     *************************/
    this.setData({ me_max_width: wx.getSystemInfoSync().windowWidth - 150 })
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function () {
    var query = wx.createSelectorQuery();
    query.select('#todos').boundingClientRect((rect) => {
      getApp().globalData.StatusBarHeight = Number(rect.top)
    }).exec();
    /*************************
     * 
     *      我
     * 
     *************************/
    var that = this
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        getApp().globalData.openid = res.result.openid
        wx.getStorage({
          key: 'briefInfo',
          success: re => {
            that.setData({
              uid: re.data.uid,
              realname: re.data.realname,
              identity: re.data.identity,
              department: re.data.department,
              post: re.data.post
            })
            that.setData({
              name: that.data.realname + ' ' + (that.data.identity == 'student' ? '同学' : that.data.post),
              description: that.data.department + (that.data.department == '' ? '' : ' ') + that.data.uid,
              welcome: false
            })
            that.data.infourl = '../Me/UserInfo/Me_userinfo'
            that.data.groupurl = '../Me/MyGroups/Me_mygroups'
            that.data.messagesurl = '../Me/Messages/Me_messages'
            that.data.historyurl = '../Me/History/Me_history'
            wx.hideLoading()
            getApp().globalData.uid = re.data.uid
            getApp().globalData.realname = re.data.realname
            getApp().globalData.identity = re.data.identity
            getApp().globalData.department = re.data.department
            getApp().globalData.post = re.data.post
            if (this.data.identity == 'teacher') {
              this.requestInvitation()
              this.requestTodos(this.data.identity, this.data.post)
            }
            else {
              this.requestTodos(this.data.identity)
            }
            var tmplIds = []
            if (this.data.identity == 'student') {
              tmplIds = ['f6bfX5Ve-DEmv-8xrEzoXedd-v_ea45Pjwa6Xv00_Uk', 'fgAy80rTjWmiBZSGXUhP-kivXym3ZPC2SBZoUs9wuUY', 'BsZI66tKemZBy47JXCycawqtf5xS8PgUo6oDbfajObg']
            }
            else {
              tmplIds = ['f6bfX5Ve-DEmv-8xrEzoXedd-v_ea45Pjwa6Xv00_Uk', 'fgAy80rTjWmiBZSGXUhP-kivXym3ZPC2SBZoUs9wuUY', '1ZBtx0qkvbDahDprSqL93sQhW-_iBQTuoLyAiSE0cp0']
            }
            this.data.tmplIds = tmplIds
            this.CheckSubscription()
          },
          fail: function (re) {
            that.requestInfo()
          },
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
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
              wx.cloud.callFunction({
                name: 'UpdateUserRelationship',
                data: {
                  collection: 'UserRelationship',
                  place: {
                    _openid: getApp().globalData.openid
                  },
                  data: {
                    avatarUrl: avatarUrl
                  }
                }
              })
              wx.cloud.callFunction({
                name: 'UpdateUserRelationship',
                data: {
                  collection: 'StudentInfo',
                  place: {
                    _openid: getApp().globalData.openid
                  },
                  data: {
                    _avatarUrl: avatarUrl
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  //生命周期函数--监听页面显示
  onShow: function () {
    /*************************
     * 
     *      我
     * 
     *************************/
    if (getApp().globalData.uid != undefined) {
      this.setData({
        name: getApp().globalData.realname + ' ' + (getApp().globalData.identity == 'student' ? '同学' : getApp().globalData.post),
        description: getApp().globalData.department + (getApp().globalData.department == '' ? '' : ' ') + getApp().globalData.uid,
        verification_status: false,
        ["list[2].dot"]: this.data.subscription_status
      })
      this.data.infourl = '../Me/UserInfo/Me_userinfo'
      this.data.groupurl = '../Me/MyGroups/Me_mygroups'
      this.data.messagesurl = '../Me/Messages/Me_messages'
      this.data.historyurl = '../Me/History/Me_history'
    }
    if (getApp().globalData.avatarUrl != undefined) {
      this.setData({ profile_photo: getApp().globalData.avatarUrl })
    }
    this.CheckSubscription()
    if (getApp().globalData.changed_todos != undefined) {
      var c = getApp().globalData.changed_todos
      if (c.new_status == 'finish') {
        this.data.arrayAccept.splice(this.data.arrayAccept.indexOf(c._id), 1)
        this.setData({
          countAccept: (this.data.countAccept - 1) >= 0 ? (this.data.countAccept - 1) : 0,
          arrayAccept: this.data.arrayAccept
        })
      }
      else if (c.new_status == 'waiting2' || c.new_status == 'accept' || c.new_status == 'reject') {
        var t = this.data.arrayWaiting.splice(this.data.arrayWaiting.indexOf(c._id), 1)[0]
        this.data.arrayFinish.push(t)
        this.setData({
          countWaiting: (this.data.countWaiting - 1) >= 0 ? (this.data.countWaiting - 1) : 0,
          countFinish: this.data.countFinish + 1,
          arrayWaiting: this.data.arrayWaiting,
          arrayFinish: this.data.arrayFinish
        })
      }
      else if (c.new_status == 'waiting') {
        this.data.arrayWaiting.push(c.data)
        this.setData({
          countWaiting: this.data.countWaiting + 1,
          arrayWaiting: this.data.arrayWaiting,
        })
      }
      else if (c.old_status == 'waiting' || c.old_status == 'waiting2') {
        this.data.arrayWaiting.splice(this.data.arrayWaiting.indexOf(c._id), 1)
        this.setData({
          countWaiting: (this.data.countWaiting - 1) >= 0 ? (this.data.countWaiting - 1) : 0,
          arrayWaiting: this.data.arrayWaiting
        })
      }
      else if (c.old_status == 'reject') {
        this.data.arrayFinish.splice(this.data.arrayFinish.indexOf(c._id), 1)
        this.setData({
          countFinish: (this.data.countFinish - 1) >= 0 ? (this.data.countFinish - 1) : 0,
          arrayFinish: this.data.arrayFinish
        })
      }
      getApp().globalData.changed_todos = undefined
    }
  },

  /*************************
   * 
   *      导航区
   * 
   *************************/
  scanning: function () {
    var that = this
    if (this.data.infourl == '../Me/IdentityAuthentication/Initialization/Me_Auth_init') {
      wx.showToast({
        title: '未认证',
        image: '../../images/error.png'
      })
    } else if (this.data.infourl == '../Me/UserInfo/Me_userinfo') {
      wx.scanCode({
        scanType: 'qrCode',
        success: function (res) {
          that.setData({ navigationLoading: true })
          var qr_result = res.result
          if (qr_result == '3e3d5be2-0c0a-4692-9fc6-092b3e5dcd25') {
            wx.navigateTo({
              url: './console'
            })
            that.setData({ navigationLoading: false })
          }
          else if (qr_result.indexOf('BUPT_Classroom_Booking_Groupid') != -1) {
            var group_id = qr_result.substring(qr_result.indexOf(':') + 1)
            wx.cloud.callFunction({
              name: 'SearchGroupsMembers',
              data: {
                id: group_id,
                method: 'add'
              },
              success: function (result) {
                var result = result.result
                if (result.getin != undefined) {
                  result.result.group_image = result.result.group_image.slice(0, -1) + '100'
                  getApp().globalData.currentGroup = result.result
                  wx.navigateTo({
                    url: '../Me/MyGroups/GroupDetails/Me_Groups_details?group_id=' + result.result._id,
                  })
                }
                else if (result.result._id != undefined) {
                  getApp().globalData.group_temp = result.result
                  wx.navigateTo({
                    url: '../Me/MyGroups/AddGroup/Me_Groups_add',
                  })
                }
                else if (result.result.indexOf('does not exist') != -1 && result.result.indexOf('document.get:fail document with _id') != -1) {
                  wx.showToast({
                    title: '团体不存在',
                    image: '../../images/wrongqrcode.png'
                  })
                }
                else {
                  wx.showToast({
                    title: '无效的二维码',
                    image: '../../images/wrongqrcode.png'
                  })
                }
                that.setData({ navigationLoading: false })
              }
            })
          }
          else if (qr_result.indexOf('BUPT_Classroom_Booking') != -1) {
            wx.showToast({
              title: '非群组二维码',
              image: '../../images/wrongqrcode.png'
            })
            that.setData({ navigationLoading: false })
          }
          else {
            wx.showToast({
              title: '无效的二维码',
              image: '../../images/wrongqrcode.png'
            })
            that.setData({ navigationLoading: false })
          }
        }
      })
    } else {
      wx.showToast({
        title: '登录中',
        image: '../../images/info.png'
      })
    }
  },

  refreshBadge: function () {
    var count = this.data.inv_count + this.data.pass_count + this.data.wait_count + this.data.fail_count
    if (count === 0) {
      if (this.data.list[0].badge != undefined) {
        delete this.data.list[0].badge
      }
    } else if (count <= 99) {
      this.data.list[0].badge = count.toString()
    } else {
      this.data.list[0].badge = '99+'
    }
    this.setData({ list: this.data.list })
  },

  /*************************
   * 
   *      活动
   * 
   *************************/

  requestInvitation: function () {
    this.setData({
      invitation_available: true,
      showLoading: true,
    })
    wx.cloud.callFunction({
      name: 'SearchUserGroups',
      data: {
        uid: getApp().globalData.uid,
        method: 'checkInvitation'
      },
      success: res => {
        try {
          var count1 = res.result.groups_info.length
          var count2 = res.result.ownership_info.length
        } catch (e) {
          this.setData({ invitation_available: false })
        }
        for (var i = 0; i < count1; i++) {
          var id = res.result.groups_info[i]._id
          for (var j = 0; j < count2; j++) {
            if (res.result.groups_info[i].manage_ownership == res.result.ownership_info[j]._openid) {
              Object.assign(res.result.groups_info[i], res.result.ownership_info[j])
              break;
            }
          }
          res.result.groups_info[i]._id = id
        }
        this.setData({
          inv_count: count1,
          invitation_groups: res.result.groups_info
        })
        this.refreshBadge()
        if (count1 == 0) {
          var that = this
          setTimeout(function () {
            that.setData({ inv_hide: true })
          }, 2000)
        }
      },
      fail: err => {
        this.setData({ invitation_available: false })
      },
      complete: res => {
        this.setData({ showLoading: false })
      }
    })
  },

  inv_accept(e) {
    var idx = e.currentTarget.id.substring(0, e.currentTarget.id.indexOf(' '))
    var id = e.currentTarget.id.substring(e.currentTarget.id.indexOf(' ') + 1)
    this.inv_handler('accept', idx, id)
  },

  inv_refuse(e) {
    var idx = e.currentTarget.id.substring(0, e.currentTarget.id.indexOf(' '))
    var id = e.currentTarget.id.substring(e.currentTarget.id.indexOf(' ') + 1)
    this.inv_handler('refuse', idx, id)
  },

  inv_handler: function (method, idx, id) {
    if (this.data.invitation_groups[idx].loading === true) { }
    else {
      this.data.invitation_groups[idx].loading = true
      this.setData({ invitation_groups: this.data.invitation_groups })
      wx.cloud.callFunction({
        name: 'SearchGroupsMembers',
        data: {
          id: id,
          method: 'invitationHandler',
          way: method,
          uid: this.data.uid
        },
        success: res => {
          this.data.invitation_groups[idx].loading = false
          if (res.result.status == 'Success') {
            wx.showToast({
              title: '成功',
              icon: 'success'
            })
            this.data.invitation_groups.splice(idx, 1)
            this.setData({
              invitation_groups: this.data.invitation_groups,
              inv_count: this.data.inv_count - 1
            })
            this.refreshBadge()
            if (this.data.inv_count == 0) {
              var that = this
              setTimeout(function () {
                that.setData({ inv_hide: true })
              }, 2000)
            }
          }
          else {
            wx.showToast({
              title: '失败',
              icon: '../../images/error.png'
            })
            this.setData({
              invitation_groups: this.data.invitation_groups
            })
          }
        },
        fail: err => {
          this.data.invitation_groups[idx].loading = false
          wx.showToast({
            title: '网络异常',
            image: '../../images/error.png'
          })
          this.setData({
            invitation_groups: this.data.invitation_groups
          })
        }
      })
    }
  },

  GoToApplication: function () {
    if (this.data.infourl == '../Me/IdentityAuthentication/Initialization/Me_Auth_init') {
      wx.showToast({
        title: '未认证',
        image: '../../images/error.png'
      })
    }
    else if (this.data.infourl == '../Me/UserInfo/Me_userinfo') {
      wx.navigateTo({ url: '../Todos/Application/Todos_submit' })
    }
    else {
      wx.showToast({
        title: '登录中',
        image: '../../images/info.png'
      })
    }
  },

  TodosAccept: function () {
    this.setData({
      arrowAccept: !this.data.arrowAccept
    })
  },

  TodosWaiting: function () {
    this.setData({
      arrowWaiting: !this.data.arrowWaiting
    })
  },

  TodosFinish: function () {
    this.setData({
      arrowFinish: !this.data.arrowFinish
    })
  },

  requestTodos: function (identity, post = 'None') {
    const db = wx.cloud.database()
    const _ = db.command
    let query = async function (_collection, _where, _field) {
      var data = []
      var count = 0
      do {
        var t = await db.collection(_collection).where(_where).field(_field).skip(count).get().then(res => { return res.data })
        data = data.concat(t)
        count = count + t.length
      } while (t.length >= 20)
      return { data, count }
    }
    if (identity == 'student') {
      var where1 = _.or({ manage_ownership: getApp().globalData.openid }, { members: getApp().globalData.openid })
      var field1 = { _id: true, group_name: true, manage_ownership: true, manage_admins: true }
      query('Groups', where1, field1).then(res => {
        var group_id = []
        var group_name = []
        var admins_id = []
        for (var i = 0; i < res.count; i++) {
          group_id.push(res.data[i]._id)
          group_name.push(res.data[i].group_name)
          if (res.data[i].manage_ownership == getApp().globalData.openid || (res.data[i].manage_admins != undefined && res.data[i].manage_admins.length != 0 && res.data[i].manage_admins.indexOf(getApp().globalData.openid) != -1)) {
            admins_id.push(res.data[i]._id)
          }
        }
        this.data.mygroup_id = group_id
        this.data.mygroups_name = group_name
        this.data.admins_id = admins_id
        var where2 = { activity_group: _.in(group_id), status: 'accept' }
        var field2 = {
          activity_group: true,
          activity_name: true,
          classroom_school: true,
          classroom: true,
          time_start: true,
          time_end: true
        }
        var where3 = { activity_group: _.in(admins_id), status: _.or(['waiting', 'waiting2']) }
        var field3 = {
          activity_group: true,
          activity_name: true,
          classroom_school: true,
          classroom_type: true,
          classroom_volume: true,
          time_start: true,
          time_end: true
        }
        var where4 = { activity_group: _.in(admins_id), status: 'reject' }
        var field4 = {
          activity_group: true,
          activity_name: true,
          classroom_school: true,
          classroom_type: true,
          classroom_volume: true,
          time_start: true,
          time_end: true,
          reason: true
        }
        return {
          accept: query('ActivityApplication', where2, field2).then(res => {
            for (var i = 0; i < res.count; i++) {
              res.data[i].activity_group = this.data.mygroups_name[this.data.mygroup_id.indexOf(res.data[i].activity_group)]
              var t_s = res.data[i].time_start
              var t_e = res.data[i].time_end
              res.data[i].date_start = t_s.split(' ')[0] + '(' + t_s.split(' ')[1] + ')'
              res.data[i].date_end = t_e.split(' ')[0] + '(' + t_e.split(' ')[1] + ')'
              res.data[i].time_start = t_s.split(' ')[2]
              res.data[i].time_end = t_e.split(' ')[2]
            }
            this.setData({
              arrayAccept: res.data,
              countAccept: res.count,
              arrowAccept: res.count == 0 ? false : true
            })
            return res.data
          }),
          waiting: query('ActivityApplication', where3, field3).then(res => {
            for (var i = 0; i < res.count; i++) {
              res.data[i].activity_group = this.data.mygroups_name[this.data.mygroup_id.indexOf(res.data[i].activity_group)]
              var t_s = res.data[i].time_start
              var t_e = res.data[i].time_end
              res.data[i].date_start = t_s.split(' ')[0] + '(' + t_s.split(' ')[1] + ')'
              res.data[i].date_end = t_e.split(' ')[0] + '(' + t_e.split(' ')[1] + ')'
              res.data[i].time_start = t_s.split(' ')[2]
              res.data[i].time_end = t_e.split(' ')[2]
            }
            this.setData({
              arrayWaiting: res.data,
              countWaiting: res.count,
              arrowWaiting: res.count == 0 ? false : true
            })
            return res.data
          }),
          finish: query('ActivityApplication', where4, field4).then(res => {
            for (var i = 0; i < res.count; i++) {
              res.data[i].activity_group = this.data.mygroups_name[this.data.mygroup_id.indexOf(res.data[i].activity_group)]
              var t_s = res.data[i].time_start
              var t_e = res.data[i].time_end
              res.data[i].date_start = t_s.split(' ')[0] + '(' + t_s.split(' ')[1] + ')'
              res.data[i].date_end = t_e.split(' ')[0] + '(' + t_e.split(' ')[1] + ')'
              res.data[i].time_start = t_s.split(' ')[2]
              res.data[i].time_end = t_e.split(' ')[2]
            }
            this.setData({
              arrayFinish: res.data,
              countFinish: res.count,
              arrowFinish: res.count == 0 ? false : true
            })
            return res.data
          }),
        }
      }).then(res => {
        console.log(res)
      })
    }
    else if (post != '教务处') {
      var where1 = { manage_teacher: getApp().globalData.openid }
      var field1 = { _id: true, group_name: true }
      query('Groups', where1, field1).then(res => {
        var group_id = []
        var group_name = []
        for (var i = 0; i < res.count; i++) {
          group_id.push(res.data[i]._id)
          group_name.push(res.data[i].group_name)
        }
        this.data.mygroup_id = group_id
        this.data.mygroups_name = group_name
        var where3 = { activity_group: _.in(group_id), status: 'waiting' }
        var field3 = {
          activity_group: true,
          activity_name: true,
          classroom_school: true,
          classroom_type: true,
          classroom_volume: true,
          time_start: true,
          time_end: true
        }
        var where4 = { activity_group: _.in(group_id), status: _.or(['waiting2', 'reject', 'accept']) }
        var field4 = {
          activity_group: true,
          activity_name: true,
          classroom_school: true,
          classroom_type: true,
          classroom_volume: true,
          time_start: true,
          time_end: true,
          reason: true
        }
        return {
          waiting: query('ActivityApplication', where3, field3).then(res => {
            for (var i = 0; i < res.count; i++) {
              res.data[i].activity_group = this.data.mygroups_name[this.data.mygroup_id.indexOf(res.data[i].activity_group)]
              var t_s = res.data[i].time_start
              var t_e = res.data[i].time_end
              res.data[i].date_start = t_s.split(' ')[0] + '(' + t_s.split(' ')[1] + ')'
              res.data[i].date_end = t_e.split(' ')[0] + '(' + t_e.split(' ')[1] + ')'
              res.data[i].time_start = t_s.split(' ')[2]
              res.data[i].time_end = t_e.split(' ')[2]
            }
            this.setData({
              arrayWaiting: res.data,
              countWaiting: res.count,
              arrowWaiting: res.count == 0 ? false : true
            })
            return res.data
          }),
          finish: query('ActivityApplication', where4, field4).then(res => {
            for (var i = 0; i < res.count; i++) {
              res.data[i].activity_group = this.data.mygroups_name[this.data.mygroup_id.indexOf(res.data[i].activity_group)]
              var t_s = res.data[i].time_start
              var t_e = res.data[i].time_end
              res.data[i].date_start = t_s.split(' ')[0] + '(' + t_s.split(' ')[1] + ')'
              res.data[i].date_end = t_e.split(' ')[0] + '(' + t_e.split(' ')[1] + ')'
              res.data[i].time_start = t_s.split(' ')[2]
              res.data[i].time_end = t_e.split(' ')[2]
            }
            this.setData({
              arrayFinish: res.data,
              countFinish: res.count,
              arrowFinish: res.count == 0 ? false : true
            })
            return res.data
          }),
        }
      }).then(res => {
        console.log(res)
      })
    }
    else {
      var where3 = { status: 'waiting2' }
      var field3 = {
        activity_group: true,
        activity_name: true,
        classroom_school: true,
        classroom_type: true,
        classroom_volume: true,
        time_start: true,
        time_end: true
      }
      var where4 = { status: _.or(['reject', 'accept']) }
      var field4 = {
        activity_group: true,
        activity_name: true,
        classroom_school: true,
        classroom_type: true,
        classroom_volume: true,
        time_start: true,
        time_end: true,
        reason: true
      }
      query('ActivityApplication', where3, field3).then(res => {
        for (var i = 0; i < res.count; i++) {
          res.data[i].activity_group = this.data.mygroups_name[this.data.mygroup_id.indexOf(res.data[i].activity_group)]
          var t_s = res.data[i].time_start
          var t_e = res.data[i].time_end
          res.data[i].date_start = t_s.split(' ')[0] + '(' + t_s.split(' ')[1] + ')'
          res.data[i].date_end = t_e.split(' ')[0] + '(' + t_e.split(' ')[1] + ')'
          res.data[i].time_start = t_s.split(' ')[2]
          res.data[i].time_end = t_e.split(' ')[2]
        }
        this.setData({
          arrayWaiting: res.data,
          countWaiting: res.count,
          arrowWaiting: res.count == 0 ? false : true
        })
        return res.data
      })
      query('ActivityApplication', where4, field4).then(res => {
        for (var i = 0; i < res.count; i++) {
          res.data[i].activity_group = this.data.mygroups_name[this.data.mygroup_id.indexOf(res.data[i].activity_group)]
          var t_s = res.data[i].time_start
          var t_e = res.data[i].time_end
          res.data[i].date_start = t_s.split(' ')[0] + '(' + t_s.split(' ')[1] + ')'
          res.data[i].date_end = t_e.split(' ')[0] + '(' + t_e.split(' ')[1] + ')'
          res.data[i].time_start = t_s.split(' ')[2]
          res.data[i].time_end = t_e.split(' ')[2]
        }
        this.setData({
          arrayFinish: res.data,
          countFinish: res.count,
          arrowFinish: res.count == 0 ? false : true
        })
        return res.data
      })
    }
  },

  GoToApplicationResult(e) {
    wx.navigateTo({
      url: '../Todos/Result/Todos_result?_id=' + e.currentTarget.id,
    })
  },

  /*************************
   * 
   *      查询
   * 
   *************************/

  bindSchoolBuilding_Change: function (e) {
    this.setData({
      school_building_value: this.data.school_choice[e.detail.value[0]] + ' ' + this.data.building_choice[e.detail.value[0]][e.detail.value[1]],
      school_building_index: e.detail.value
    })
    if ((e.detail.value[0] == 0 && e.detail.value[1] < 2) || (e.detail.value[0] == 1 && e.detail.value[1] > 2 && e.detail.value[1] < 5)) {
      this.setData({
        classroom_multi: true,
        classroom_multi_array: this.data.classroom_choice[e.detail.value[0]][e.detail.value[1]][0],
        classroom_multi_index: [0,0],
        classroom_value: this.data.classroom_choice[e.detail.value[0]][e.detail.value[1]][0][1][0]
      })
    }
    else {
      this.setData({
        classroom_multi: false,
        classroom_single_array: this.data.classroom_choice[e.detail.value[0]][e.detail.value[1]],
        classroom_single_index: 0,
        classroom_value: this.data.classroom_choice[e.detail.value[0]][e.detail.value[1]][0]
      })
    }
  },

  bindSchoolBuilding_Column: function (e) {
    if (e.detail.column == 0) {
      this.setData({
        school_building_array: [this.data.school_choice, this.data.building_choice[e.detail.value]]
      })
    }
  },

  bindClassroom_MultiChange: function (e) {
    this.setData({
      classroom_value: this.data.classroom_multi_array[1][e.detail.value[1]],
      classroom_multi_index: e.detail.value
    })
  },

  bindClassroom_Column: function (e) {
    if (e.detail.column == 0) {
      this.setData({
        classroom_multi_array: this.data.classroom_choice[this.data.school_building_index[0]][this.data.school_building_index[1]][e.detail.value]
      })
    }
  },

  bindClassroom_Change: function (e) {
    this.setData({
      classroom_value: this.data.classroom_single_array[1][e.detail.value],
      classroom_single_index: e.detail.value
    })
  },

  bindDateSChange: function (e) {
    this.setData({
      DateS_value: e.detail.value
    })
    this.checkTime()
  },


  bindDateEChange: function (e) {
    this.setData({
      DateE_value: e.detail.value
    })
    this.checkTime()
  },

  bindSectionSChange: function (e) {
    this.setData({
      sectionS_value: this.data.time_array[e.detail.value],
      sectionS_index: e.detail.value
    })
    this.checkTime()
  },

  bindSectionEChange: function (e) {
    this.setData({
      sectionE_value: this.data.time_array[e.detail.value],
      sectionE_index: e.detail.value
    })
    this.checkTime()
  },

  checkTime: function () {
    if (this.data.DateS_value != '单击此处选择' && this.data.DateE_value != '单击此处选择' && this.data.sectionS_value != '单击此处选择' && this.data.sectionE_value != '单击此处选择') {
      if (this.compareDate(this.data.DateS_value, '2020-02-24') < 0 || this.compareDate(this.data.DateE_value, '2020-02-24') < 0 || this.compareDate(this.data.DateS_value, '2020-07-03') > 0 || this.compareDate(this.data.DateE_value, '2020-07-03') > 0) {
        this.setData({
          time_footer: 'reject',
          time_footer_text: '开始日期及结束日期超出当前学期范围'
        })
      }
      else if (this.data.sectionS_index > this.data.sectionE_index || this.compareDate(this.data.DateS_value, this.data.DateE_value) > 0) {
        this.setData({
          time_footer: 'reject',
          time_footer_text: '开始日期及节次均不能晚于结束日期及节次'
        })
      }
      else {
        this.setData({
          time_footer: 'accept',
          time_footer_text: '已选择时间'
        })
      }
    }
  },

  ResetInput: function () {
    this.setData({
      school_building_array: [this.data.school_choice, this.data.building_choice[0]],
      school_building_index: [0, 0],
      school_building_value: '沙河校区 教学实验综合楼北楼',
      classroom_multi: true,
      classroom_multi_array: this.data.classroom_choice[0][0][0],
      classroom_multi_index: [0, 0],
      classroom_single_index: 0,
      classroom_value: 'N103',
      sectionS_index: 0,
      sectionE_index: 0,
      sectionS_value: '单击此处选择',
      sectionE_value: '单击此处选择',
      DateS_value: '单击此处选择',
      DateE_value: '单击此处选择',
      time_footer: '',
      time_footer_text: '请选择时间',
    })
  },

  Query: function () {
    var query_param = {
      classroom: this.data.classroom_value,
      dateS: this.data.DateS_value,
      sectionS: parseInt(this.data.sectionS_index) + 1,
      dateE: this.data.DateE_value,
      sectionE: parseInt(this.data.sectionE_index) + 1
    }
    wx.navigateTo({
      url: '../Query/Query?param=' + JSON.stringify(query_param),
    })
  },

  /*************************
   * 
   *      我
   * 
   *************************/

  requestInfo: function () {
    var that = this
    db.collection('UserRelationship').where({
      _openid: getApp().globalData.openid
    }).get().then(result => {
      if (result.data[0] != undefined && result.data[0]._openid == getApp().globalData.openid) {
        that.setData({
          uid: result.data[0].uid,
          realname: result.data[0].realname,
          identity: result.data[0].identity,
          department: result.data[0].department,
          post: result.data[0].post
        })
        that.setData({
          name: that.data.realname + ' ' + (that.data.identity == 'student' ? '同学' : that.data.post),
          description: that.data.department + (that.data.department == '' ? '' : ' ') + that.data.uid,
          welcome: false
        })
        this.data.infourl = '../Me/UserInfo/Me_userinfo'
        this.data.groupurl = '../Me/MyGroups/Me_mygroups'
        this.data.messagesurl = '../Me/Messages/Me_messages'
        this.data.historyurl = '../Me/History/Me_history'
        getApp().globalData.uid = result.data[0].uid
        getApp().globalData.realname = result.data[0].realname
        getApp().globalData.identity = result.data[0].identity
        getApp().globalData.department = result.data[0].department
        getApp().globalData.post = result.data[0].post
        wx.setStorage({
          key: 'briefInfo',
          data: {
            uid: result.data[0].uid,
            realname: result.data[0].realname,
            identity: result.data[0].identity,
            department: result.data[0].department,
            post: result.data[0].post
          }
        })
      }
      else {
        that.setData({
          verification_status: true,
          name: '未绑定用户',
          description: '单击此处前往绑定',
          ["list[2].dot"]: true
        })
        that.data.infourl = '../Me/IdentityAuthentication/Initialization/Me_Auth_init'
      }
    }).catch(err => {
      wx.showToast({
        title: '网络异常',
        image: '../../images/error.png'
      })
    })
  },

  tabChange(e) {
    var index = e.detail.index
    if (index == 2) {
      if (this.data.infourl != '../Me/UserInfo/Me_userinfo') {
        wx.showLoading({
          title: '加载中',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }
      this.setData({
        background: false,
        title: ''
      })
    } else {
      wx.hideLoading()
      this.setData({
        background: true,
        title: '邮教有约'
      })
    }
    this.setData({
      current: index
    })
    if ((!this.data.subscription_status) && this.data.platform != 'devtools' && (!this.data.PCmode)) {
      wx.requestSubscribeMessage({
        tmplIds: this.data.tmplIds
      })
    }
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },

  GoToUserInfo: function () {
    wx.navigateTo({ url: this.data.infourl })
  },
  GoToMyGroups: function () {
    if (this.data.groupurl != '../Me/MyGroups/Me_mygroups') {
      wx.showToast({
        title: '登录中',
        image: '../../images/info.png'
      })
    }
    else {
      wx.navigateTo({ url: this.data.groupurl })
    }
  },
  GoToMessages: function () {
    if (this.data.messagesurl != '../Me/Messages/Me_messages') {
      wx.showToast({
        title: '登录中',
        image: '../../images/info.png'
      })
    }
    else {
      wx.navigateTo({ url: this.data.messagesurl })
    }
  },
  GoToHistory: function () {
    if (this.data.historyurl != '../Me/History/Me_history') {
      wx.showToast({
        title: '登录中',
        image: '../../images/info.png'
      })
    }
    else {
      wx.navigateTo({ url: this.data.historyurl })
    }
  },
  GoToSettings: function () {
    wx.navigateTo({ url: '../Me/Settings/Me_settings' })
  },
  GoToSubscription: function () {
    wx.navigateTo({ url: '../Me/Settings/Subscription/Me_Settings_subscription' })
  },
  CheckSubscription: function () {
    if (this.data.tmplIds != undefined && this.compareVersion(wx.getSystemInfoSync().SDKVersion, '2.10.1') >= 0) {
      var tmplIds = this.data.tmplIds
      wx.getSetting({
        withSubscriptions: true,
        success: result => {
          if (result.subscriptionsSetting[tmplIds[0]] == 'reject' || result.subscriptionsSetting[tmplIds[1]] == 'reject' || result.subscriptionsSetting[tmplIds[2]] == 'reject') {
            this.setData({
              subscription_status: true,
              ["list[2].dot"]: true
            })
          }
          else {
            this.setData({
              subscription_status: false,
              ["list[2].dot"]: this.data.verification_status
            })
          }
        }
      })
    }
  },

  compareVersion: function (v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }

    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])

      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }

    return 0
  },

  compareDate: function (v1, v2) {
    v1 = v1.split('-')
    v2 = v2.split('-')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }

    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])

      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }

    return 0
  }

})
