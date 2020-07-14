// miniprogram/pages/Me/MyGroups/GroupDetails/Me_Groups_details.js
const QR = require('../../../../utils/weapp-qrcode.js')
const PY = require('../../../../utils/convert-pinyin.js')

Page({

  //页面的初始数据
  data: {
    PCmode: false,
    navigationbar_show: false,
    navigation_background: 'nav-color-default',
    type_background: '#7F7F7F',
    title: '团体管理',
    showActionsheet: false,
    groups: [
      { text: '修改团体名称', value: 1 },
      { text: '修改团体头像', value: 2 },
      { text: '修改团体简介', value: 3 }
    ],
    image: '/images/group.png',
    name: '加载中……',
    description: '加载中……',
    type: '',
    admins_mode: 0,
    members_title: '团体成员',
    members_array: [],
    space: ' ',
    manageMembers_mode: false,
    manage_title: '团体管理',
    manageMembers_title: '管理成员',
    manageAdmins_title: '设置管理员',
    manageTeacher_title: '邀请团体教师',
    manageOwnership_title: '转让负责人',
    managePrivacy_title: '更改加入方式',
    groupLog_title: '查看申请记录',
    dialogAdminsShow: false,
    dialogMembersShow: false,
    dialogRemoveMembersShow: false,
    dialogOwnershipShow: false,
    dialogOwnershipEnsureShow: false,
    dialogExitShow: false,
    buttons: [{ text: '取消' }, { text: '确定' }],
    FinishLoading: false,
    showPhotoDialog: false,
    showPhotoDialog2: false,
    buttons2: [{
      type: 'default',
      disabled: false,
      loading: false,
      className: '',
      text: '取消',
      value: 0
    },
    {
      type: 'primary',
      disabled: true,
      loading: false,
      className: '',
      text: '确定',
      value: 1
    }
    ],
    qq_items: [{ name: 'group', value: 'QQ群', checked: 'true' }, { name: 'qq', value: '个人QQ' }],
    qq_type: 'group',
    alert: ' ',
    showNameDialog: false,
    showNameDialog2: false,
    showDescDialog: false,
    showDescDialog2: false,
    manageAdmins_mode: false,
    manageMembers_mode: false,
    showSearch: false,
    index_delete: -1,
    index_admins_delete: -1,
    add_index: -1,
    remove_index: -1,
    arrange_mode: 1,
    arrange_admin: false,
    functions_bottom: 2000,
    animation_enabled: false,
    ownership_index: -1,
    toView: 'unset',
    scrollHeight: 1000,
    sidebar_timer: undefined,
    real_idx: -1,
    members_list_current: -10,
    members_list_moving: true,
    admins_height: 0,
    scrollTop: 0,
    privacy: '10',
    maskProfile: false,
    userProfile: {
      __realname: "加载中……"
    }
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    if (getApp().globalData.systemPlatform.indexOf('macOS') != -1 || getApp().globalData.systemPlatform.indexOf('Windows') != -1 || getApp().globalData.systemPlatform.indexOf('win') != -1) {
      this.setData({
        PCmode: true
      })
    }
    var query = wx.createSelectorQuery();
    var global_group = getApp().globalData.currentGroup
    var that = this
    query.select('#brief').boundingClientRect((rect) => {
      this.setData({
        navigation_bar_height: Number(rect.top),
        scrollHeight: wx.getSystemInfoSync().windowHeight - Number(rect.top)
      })
    }).exec();
    this.setData({
      profile: '',
      search_word: '',
      members_admins_detail: [],
      admins_array: [],
      remove_array: [],
      remove_index_array: [],
      margin: Math.round((wx.getSystemInfoSync().windowWidth - 320) / 2),
      padding: Math.round((wx.getSystemInfoSync().windowHeight - 500) / 2),
      arrange_mode: global_group.group_type == 'associations' ? 3 : 1,
      navigation_background: global_group.group_type == 'associations' ? (global_group.subtype == '社团' ? 'nav-color-green' : 'nav-color-blue') : 'nav-color-red',
      type_background: global_group.group_type == 'associations' ? (global_group.subtype == '社团' ? '#1dd1a1' : '#54a0ff') : '#ff6b6b',
      group_id: options.group_id,
      image: global_group.group_image == '/images/group.png' ? '/images/group.png' : global_group.group_image.slice(0, -3) + '0',
      image_color: global_group.group_image == '/images/group.png' ? global_group.group_image_color : '',
      image_text: global_group.group_image == '/images/group.png' ? global_group.group_image_text : '',
      name: global_group.group_name,
      description: global_group.group_description,
      type: global_group.group_type == 'associations' ? global_group.subtype : '班级',
      manageTeacher_title: '邀请' + (global_group.group_type == 'associations' ? '指导教师' : '辅导员'),
      openid: getApp().globalData.openid,
      showLoading: true,
      members_max_width: wx.getSystemInfoSync().windowWidth - 220,
      groups_array: getApp().globalData.groups_array
    })
    wx.getStorage({
      key: options.group_id,
      success: function (result) {
        that.getGroupMemberInfo(options.group_id, 'verify', result.data.members_array)
        that.setData({
          members_title: '团体成员 (' + result.data.members_array.length + ')',
          members_array: result.data.members_array,
          members_detail: result.data.members_detail
        })
        that.setData({
          current_member: that.data.members_detail.length,
          new_member: that.data.members_detail.length - 1
        })
      },
      fail: function (result) {
        that.getGroupMemberInfo(options.group_id, 'get')
      }
    })
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function () {
    //console.log(wx.getSystemInfoSync().windowHeight)
    this.data.members_name_detail = []
    this.data.members_list = []
    for (var i = 0; i <= 26; i++) {
      var _char = i > 0 ? String.fromCharCode(64 + i) : '#'
      var characters = '0ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      var obj_temp = {
        title: _char,
        index_delete: -1,
        current_member: 0,
        new_member: 0,
        members: []
      }
      var obj_t = {
        title: _char,
        top: i * 20
      }
      this.data.members_name_detail.push(JSON.parse(JSON.stringify(obj_temp)))
      this.data.members_list.push(0)
    }
    if (this.data.arrange_mode == 3) {
      if (this.data.members_detail != undefined) {
        this.admins_sort()
      }
      var query = wx.createSelectorQuery();
      query.select('#brief').boundingClientRect()
      query.select('#functions').boundingClientRect()
      query.exec((res) => {
        this.data.brief_height = res[0].height
        this.data.functions_bottom = res[1].top + res[1].height + this.data.scrollTop
        console.log(res, this.data.functions_bottom)
      })
    }
  },
  //生命周期函数--监听页面显示
  onShow: function () {
    if (getApp().globalData.privacy != undefined) {
      this.setData({
        privacy: getApp().globalData.privacy
      })
      getApp().globalData.privacy = undefined
    }
    if (getApp().globalData.verifiedItems != undefined) {
      this.setData({
        verified_members: getApp().globalData.verifiedItems,
        verified_members_length: getApp().globalData.verifiedItems.length,
      })
      getApp().globalData.verifiedItems = undefined
    }
    if (getApp().globalData.newmember) {
      console.log('test156968189')
      getApp().globalData.newmember = false
      this.getGroupMemberInfo(this.data.group_id, 'get')
    }
    var query = wx.createSelectorQuery();
    query.select('#brief').boundingClientRect((rect) => {
      this.data.brief_height = rect.height
    }).exec();
  },

  blank(e) { },

  back: function () {
    var data = this.data;
    wx.navigateBack({
      delta: data.delta
    });
    this.triggerEvent('back', { delta: data.delta }, {});
  },

  scroll(e) {
    this.data.scrollTop = e.detail.scrollTop
    this.changePos()
  },
  changePos() {
    if (this.data.arrange_mode == 3 && this.data.members_list_moving) {
      var top = this.data.scrollTop - this.data.functions_bottom + this.data.navigation_bar_height - (this.data.arrange_admin ? this.data.admins_height : 0) + ((this.data.manageMembers_mode || this.data.manageAdmins_mode || this.data.manageOwnership_mode) ? this.data.brief_height : 0)
      if (top > 0) {
        for (var i = 0; i <= 26; i++) {
          if (this.data.members_list[i] != 0) {
            top = top - this.data.members_list[i]
            if (top <= 0) {
              if (this.data.members_list_current != i) {
                this.data.members_list_current = i
                this.selectComponent('#sidebar').sidebar_setindex(i)
                this.selectComponent('#sidebar').sidebar_setselcted(i)
              }
              break
            }
          }
        }
      }
    }
  },

  PreviewImage: function () {
    wx.previewImage({
      urls: [this.data.image],
    })
  },

  RefreshMembersList: function () {
    this.setData({
      members_detail: this.data.members_detail,
      members_name_detail: this.data.members_name_detail,
      members_admins_detail: this.data.members_admins_detail
    })
    if (this.data.arrange_mode == 3) {
      for (var i = 0; i <= 26; i++) {
        var count = this.data.members_name_detail[i].current_member - (this.data.showSearch ? this.data.members_name_detail[i].search_member : 0)
        if (count > 0) {
          this.data.members_list[i] = 41 + count * 62
        }
        else {
          this.data.members_list[i] = 0
        }
      }
    }
  },

  qrcode: function () {
    var imgData = QR.drawImg('BUPT_Classroom_Booking_Groupid:' + this.data.group_id, {
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
      that.setData({
        mask: false
      })
    }, 300)
  },

  tapDialogAdminsButton(e) {
    if (e.detail.index == 0) {
      for (var i = 0; i < this.data.members_detail.length; i++) {
        this.data.members_detail[i].admint = this.data.members_detail[i].admin
      }
      this.data.admins_array = this.data.admins_temp
      this.admins_sort()
      this.RefreshMembersList()
    } else {
      this.Finish()
    }
    this.setData({
      dialogAdminsShow: false
    })
  },

  tapDialogMembersButton(e) {
    if (e.detail.index == 0) {
      for (var i = 0; i < this.data.remove_index_array.length; i++) {
        this.data.members_detail[this.data.remove_index_array[i]].deleted = false
      }
      this.RefreshMembersList()
      this.data.remove_array = [],
        this.data.remove_index_array = []
      this.setData({
        members_title: '团体成员 (' + this.data.members_array.length + ')',
      })
      this.admins_sort()
      console.log(this.data.members_detail)
    } else {
      this.Finish()
    }
    this.setData({
      dialogMembersShow: false
    })
  },

  tapDialogRemoveMembersButton(e) {
    if (e.detail.index == 1) {
      this.data.remove_array.push(this.data.openid_temp)
      this.data.remove_index_array.push(this.data.number_temp)
      var that = this
      if ((!this.data.arrange_admin) || (!this.data.members_detail[this.data.number_temp].admin)) {
        if (this.data.arrange_mode == 1) {
          setTimeout(function () {
            that.setData({
              index_delete: that.data.index_temp,
              current_member: that.data.current_member,
              new_member: that.data.new_member
            })
          }, 300)
          setTimeout(function () {
            that.setData({
              members_title: '团体成员 (' + (that.data.members_array.length - that.data.remove_array.length) + ')',
              ["members_detail[" + that.data.index_temp + "].deleted"]: true
            })
            that.setData({
              index_delete: -1
            })
            that.data.current_member = that.data.new_member--
            if (that.data.current_member - (that.data.showSearch ? that.data.search_member : 0) <= 0) {
              that.setData({
                current_member: that.data.current_member
              })
            }
          }, 1000)
        } else {
          var initial = PY.pinyin.getFullChars(this.data.members_detail[this.data.number_temp].__realname).slice(0, 1)
          var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
          var flag = (characters.indexOf(initial) == -1) ? 0 : ((characters.indexOf(initial) % 26) + 1)
          setTimeout(function () {
            that.data.members_name_detail[flag].index_delete = that.data.index_temp
            that.setData({
              members_name_detail: that.data.members_name_detail
            })
          }, 300)
          setTimeout(function () {
            that.setData({
              members_title: '团体成员 (' + (that.data.members_array.length - that.data.remove_array.length) + ')',
              ["members_name_detail[" + flag + "].members.[" + that.data.index_temp + "].deleted"]: true
            })
            that.setData({
              ["members_name_detail[" + flag + "].index_delete"]: -1
            })
            that.data.members_name_detail[flag].current_member = that.data.members_name_detail[flag].new_member--
            if (that.data.members_name_detail[flag].current_member - (that.data.showSearch ? that.data.members_name_detail[flag].search_member : 0) <= 0) {
              that.setData({
                ["members_name_detail[" + flag + "].current_member"]: that.data.members_name_detail[flag].current_member
              })
            }
            for (var i = 0; i <= 26; i++) {
              var count = that.data.members_name_detail[i].current_member - (that.data.showSearch ? that.data.members_name_detail[i].search_member : 0)
              if (count > 0) {
                that.data.members_list[i] = 41 + count * 62
              }
              else {
                that.data.members_list[i] = 0
              }
            }
          }, 1000)
        }
      } else {
        setTimeout(function () {
          that.setData({
            index_admins_delete: that.data.index_temp,
            current_admins_member: that.data.current_admins_member,
            new_admins_member: that.data.new_admins_member
          })
        }, 300)
        setTimeout(function () {
          that.setData({
            members_title: '团体成员 (' + (that.data.members_array.length - that.data.remove_array.length) + ')',
            ["members_admins_detail[" + that.data.index_temp + "].deleted"]: true
          })
          that.setData({
            index_admins_delete: -1
          })
          that.data.current_admins_member = that.data.new_admins_member--
          if (that.data.current_admins_member - (that.data.showSearch ? that.data.search_admins_member : 0) <= 0) {
            that.setData({
              current_admins_member: that.data.current_admins_member
            })
          }
        }, 1000)
      }
    }
    this.setData({
      dialogRemoveMembersShow: false
    })
  },

  tapDialogOwnershipButton(e) {
    if (e.detail.index == 1) {
      this.setData({
        FinishLoading: true
      })
      var that = this
      wx.cloud.callFunction({
        name: 'SearchGroupsMembers',
        data: {
          id: this.data.group_id,
          method: 'UpdateInfo',
          content: 'ownership',
          data: {
            manage_ownership: this.data.members_detail[this.data.ownership_index]._openid
          }
        },
        success: function (res) {
          if (res.result.status == 'Success') {
            wx.showToast({
              title: '成功',
              icon: 'success',
            })
            that.animation_home()
            that.admins_sort()
          } else {
            that.setData({
              dialogOwnershipShow: true
            })
          }
          that.setData({
            FinishLoading: false
          })
        },
        fail: function (err) {
          that.setData({
            dialogOwnershipShow: true
          })
          that.setData({
            FinishLoading: false
          })

        }
      })
    } else {
      this.setData({
        FinishLoading: false,
      })
    }
    this.setData({
      dialogOwnershipEnsureShow: false
    })
  },

  tapDialogExitButton(e) {
    if (e.detail.index == 1) {
      this.setData({
        FinishLoading: true
      })
      var that = this
      wx.cloud.callFunction({
        name: 'SearchGroupsMembers',
        data: {
          id: this.data.group_id,
          method: 'exit'
        },
        success: function (res) {
          if (res.result.status == 'Exit Success' || res.result.status == 'Delete Success') {
            wx.showToast({
              title: res.result.status == 'Exit Success' ? '退出成功' : '解散成功',
              icon: 'success',
              success: function (result) {
                getApp().globalData.newgroup = true
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1500)
              }
            })
          } else {
            wx.showToast({
              title: '失败',
              image: '../../../../images/error.png'
            })
          }
          that.setData({
            FinishLoading: false
          })
        },
        fail: function (err) {
          wx.showToast({
            title: '网络异常',
            image: '../../../../images/network.png'
          })
          that.setData({
            FinishLoading: false
          })
        }
      })
    } else {
      this.setData({
        FinishLoading: false
      })
    }
    this.setData({
      dialogExitShow: false
    })
  },

  sidebar_start(e) {
    if (this.data.sidebar_timer != undefined) {
      clearTimeout(this.data.sidebar_timer)
      this.data.sidebar_timer = undefined
    }
    this.data.members_list_moving = false
    var idx = this.selectComponent('#sidebar').sidebar_getinfo()
    var i = this.sidebar_find(idx)
    if (i >= 0) {
      this.sidebar_navigate(i)
    }
  },
  sidebar_move(e) {
    var idx = this.selectComponent('#sidebar').sidebar_getinfo()
    var i = this.sidebar_find(idx)
    if (i >= 0) {
      this.sidebar_navigate(i)
    }
  },
  sidebar_end(e) {
    setTimeout(() => {
      this.data.members_list_moving = true
    }, 100)
    var idx = this.selectComponent('#sidebar').sidebar_getinfo()
    var i = this.sidebar_find(idx, 'e')
    var timer = setTimeout(() => {
      var t = ((this.data.real_idx < 0) ? i : this.data.real_idx)
      this.selectComponent('#sidebar').sidebar_setselcted(t)
      this.data.real_idx = -1
      this.data.sidebar_timer = undefined
    }, 1000)
    this.data.sidebar_timer = timer
  },
  sidebar_find(flag, method = 'm') {
    flag = (flag < 0) ? 0 : flag
    flag = (flag > 26) ? 26 : flag
    var i = flag
    while (this.data.members_name_detail[i].current_member - (this.data.showSearch ? this.data.members_name_detail[i].search_member : 0) <= 0) {
      i++
      if (i > 26) {
        i = flag - 1
        while (this.data.members_name_detail[i].current_member - (this.data.showSearch ? this.data.members_name_detail[i].search_member : 0) <= 0) {
          i--
          if (i <= 0) {
            break;
          }
        }
        break;
      }
    }
    if (method == 'e') {
      var that = this;
      var characters = '0ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (var j = i; j >= 0; j--) {
        if (this.data.members_name_detail[j].current_member - (this.data.showSearch ? this.data.members_name_detail[j].search_member : 0) > 0) {
          var query = wx.createSelectorQuery();
          query.select('#members_' + characters.charAt(j)).boundingClientRect((rect) => {
            var id = rect.id.replace(/members_/, "")
            if (rect.top - this.data.navigation_bar_height < 20) {
              this.data.real_idx = (characters.indexOf(id) > this.data.real_idx ? characters.indexOf(id) : this.data.real_idx)
            }
          }).exec();
        }
      }
    }
    return i
  },
  sidebar_navigate(i) {
    var that = this;
    var characters = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var id = ((i == 0) ? 0 : characters.charAt(i))
    this.setData({
      toView: 'members_' + id
    })
  },

  getGroupMemberInfo: function (groupid, method, members = []) {
    var that = this
    wx.cloud.callFunction({
      name: 'SearchGroupsMembers',
      data: {
        id: groupid,
        method: method,
        members: members
      },
      success: function (result) {
        console.log(result)
        if (result.result.verification == false) {
          wx.setStorage({
            key: groupid,
            data: {
              members_array: result.result.members_array,
              members_detail: result.result.member_res
            },
          })
          for (var i = 0; i < result.result.member_res.length; i++) {
            if (that.data.members_array.indexOf(result.result.member_res[i]._openid) == -1) {
              result.result.member_res[i].new_user = true
            }
          }
          that.setData({
            members_title: '团体成员 (' + result.result.members_array.length + ')',
            members_array: result.result.members_array,
            members_detail: result.result.member_res
          })
        }
        if (result.result.admins != [] && result.result.admins != undefined) {
          var admins = new Array
          for (var i = 0; i < result.result.admins.length; i++) {
            admins.push(result.result.admins[i])
          }
          that.data.admins_array = result.result.admins
          that.setData({
            admins_title: (getApp().globalData.currentGroup.group_type == 'associations' ? getApp().globalData.currentGroup.subtype : '班级') + '管理员 (' + result.result.admins.length + ')'
          })
        } else {
          that.setData({
            admins_title: (getApp().globalData.currentGroup.group_type == 'associations' ? getApp().globalData.currentGroup.subtype : '班级') + '管理员 (0)'
          })
        }
        for (var i = 0; i < that.data.members_array.length; i++) {
          that.data.members_detail[i].number = i
          if (result.result.admins != [] && result.result.admins != undefined) {
            if (admins != []) {
              for (var j = 0; j < admins.length; j++) {
                if (that.data.members_detail[i]._openid == admins[j]) {
                  that.data.members_detail[i].admin = true
                  that.data.members_detail[i].admint = true
                  admins.splice(j, 1)
                } else {
                  that.data.members_detail[i].admin = false
                  that.data.members_detail[i].admint = false
                }
              }
            } else {
              break;
            }
          }
        }
        console.log(result.result)
        that.setData({
          showLoading: false,
          navigation_loading: false,
          admins_mode: result.result.admins_mode,
          ownership: result.result.ownership,
          privacy: result.result.privacy,
          verified_members: result.result.verified_members,
          verified_members_length: result.result.verified_members.length
        })
        that.admins_sort()
        if (result.result.group_description != that.data.description) {
          that.setData({
            description: result.result.group_description
          })
          wx.removeStorage({
            key: 'MyGroups'
          })
        }
      },
      fail: function (error) {
        wx.showToast({
          title: '网络异常',
          image: '../../../../images/network.png'
        })
      }
    })
  },

  updateInfo: function () {
    if (this.data.admins_mode == 10) {
      this.setData({
        title: '团体管理',
        groups: [{
          text: '修改团体名称',
          value: 1
        },
        {
          text: '修改团体头像',
          value: 2
        },
        {
          text: '修改团体简介',
          value: 3
        },
        {
          text: '解散并退出团体',
          type: 'warn',
          value: 4
        }
        ],
      })
    } else if (this.data.admins_mode == 5) {
      this.setData({
        title: '团体管理',
        groups: [{
          text: '修改团体名称',
          value: 1
        },
        {
          text: '修改团体头像',
          value: 2
        },
        {
          text: '修改团体简介',
          value: 3
        },
        {
          text: '退出团体',
          type: 'warn',
          value: 4
        }
        ],
      })
    } else {
      this.setData({
        title: '团体管理',
        groups: [{
          text: '退出团体',
          type: 'warn',
          value: 4
        }],
      })
    }
    this.setData({
      showActionsheet: true,
    })
  },
  btnClick(e) {
    if (this.data.title == '团体管理') {
      this.setData({
        [`buttons2[1].disabled`]: true,
        available: false,
        unavailable: false,
        namechecking: false,
        exist: false,
        unexist: false,
        photochecking: false,
        alert: ' '
      })
      var that = this
      if (e.detail.value == 1) {
        this.setData({
          showNameDialog2: true
        })
        setTimeout(function () {
          that.setData({
            showNameDialog: true
          })
        }, 100)
      } else if (e.detail.value == 2) {
        this.setData({
          showPhotoDialog2: true
        })
        setTimeout(function () {
          that.setData({
            showPhotoDialog: true
          })
        }, 100)
      } else if (e.detail.value == 3) {
        this.setData({
          showDescDialog2: true
        })
        setTimeout(function () {
          that.setData({
            showDescDialog: true
          })
        }, 100)
        this.setData({
          textarea_count: this.data.description.length
        })
      } else if (e.detail.value == 4) {
        this.setData({
          dialogExitShow: true
        })
      }
    } else if (this.data.title == '成员排序') {
      this.setData({
        navigation_loading: true
      })
      var that = this
      if (e.detail.value != this.data.arrange_mode) {
        this.data.arrange_mode = (e.detail.value == 5) ? this.data.arrange_mode : e.detail.value
        this.data.arrange_admin = (e.detail.value == 5) ? (!this.data.arrange_admin) : this.data.arrange_admin
        this.data.animation_enabled = (e.detail.value == 5) ? false : true
        this.admins_sort()
      }
      this.setData({
        animation_enabled: this.data.animation_enabled,
        arrange_mode: this.data.arrange_mode,
        arrange_admin: this.data.arrange_admin
      })
      if (this.data.animation_enabled) {
        setTimeout(function () {
          that.setData({
            animation_enabled: false
          })
          if (!that.data.manageMembers_mode && !that.data.manageAdmins_mode && !that.data.manageOwnership_mode) {
            var query = wx.createSelectorQuery();
            query.select('#brief').boundingClientRect()
            query.select('#functions').boundingClientRect()
            query.exec(function (res) {
              that.data.brief_height = res[0].height
              that.data.functions_bottom = res[1].top + res[1].height + that.data.scrollTop
              console.log(res, that.data.functions_bottom)
            })
          }
        }, 300)
      }
      else
        if (this.data.showSearch) {
          var e2 = {
            detail: {
              value: this.data.search_word
            }
          }
          this.Searching(e2, 0)
        }
      this.setData({
        navigation_loading: false
      })
    }
    this.setData({
      showActionsheet: false
    })
  },
  admins_sort: function () {
    if (this.data.arrange_admin) {
      var ownership = []
      var admins = []
      var members = []
      for (var i = 0; i < this.data.members_detail.length; i++) {
        if (this.data.ownership == this.data.members_detail[i]._openid) {
          ownership.push(this.data.members_detail[i])
        } else if (this.data.members_detail[i].admin === true) {
          admins.push(this.data.members_detail[i])
        } else {
          members.push(this.data.members_detail[i])
        }
      }
      this.data.members_admins_detail = ownership.concat(admins)
      this.data.current_admins_member = this.data.members_admins_detail.length
      this.data.new_admins_member = this.data.members_admins_detail.length - 1
      this.setData({
        current_admins_member: this.data.current_admins_member,
        new_admins_member: this.data.new_admins_member,
        members_admins_detail: this.data.members_admins_detail,
      })
      var that = this
      setTimeout(() => {
        var query = wx.createSelectorQuery();
        query.select('#GroupAdmins').boundingClientRect()
        query.exec(function (res) {
          that.data.admins_height = res[0].height
        })
      }, 300)
    }
    if (this.data.arrange_mode == 1) {
      this.data.current_member = this.data.members_detail.length - (this.data.arrange_admin ? this.data.current_admins_member : 0)
      this.data.new_member = this.data.members_detail.length - (this.data.arrange_admin ? this.data.current_admins_member : 0) - 1
      this.setData({
        current_member: this.data.current_member,
        new_member: this.data.new_member,
        members_detail: this.data.members_detail
      })
    }
    if (this.data.arrange_mode == 3) {
      this.pinyin_sort(this.data.arrange_admin ? members : this.data.members_detail)
      this.setData({
        members_name_detail: this.data.members_name_detail
      })
    }
  },
  pinyin_sort: function (target_array) {
    console.log(target_array)
    var flag = 0
    var count = 0
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    for (var i = 0; i < this.data.members_name_detail.length; i++) {
      this.data.members_name_detail[i].members = []
      this.data.members_name_detail[i].index_delete = -1
      this.data.members_name_detail[i].current_member = 0
      this.data.members_name_detail[i].new_member = 0
    }
    for (var i = 0; i < target_array.length; i++) {
      var initial = PY.pinyin.getFullChars(target_array[i].__realname).slice(0, 1)
      var flag = (characters.indexOf(initial) == -1) ? 0 : ((characters.indexOf(initial) % 26) + 1)
      this.data.members_name_detail[flag].members.push(target_array[i])
      this.data.members_name_detail[flag].new_member = this.data.members_name_detail[flag].current_member++
    }
    for (var i = 0; i < this.data.members_name_detail.length; i++) {
      this.data.members_name_detail[i].members = this.data.members_name_detail[i].members.sort(function (a, b) {
        if (a.__realname == b.__realname) {
          return Number(a.__uid) < Number(b.__uid) ? -1 : 1
        } else {
          return a.__realname.localeCompare(b.__realname, 'zh')
        }
      })
    }
    var height = (wx.getSystemInfoSync().windowHeight * 0.85 < 540 ? wx.getSystemInfoSync().windowHeight * 0.85 : 540)
    var value = {
      height: height,
      top: wx.getSystemInfoSync().windowHeight * 0.55 - height / 2
    }
    this.selectComponent('#sidebar').sidebar_setinfo(value)
    for (var i = 0; i <= 26; i++) {
      var count = this.data.members_name_detail[i].current_member - (this.data.showSearch ? this.data.members_name_detail[i].search_member : 0)
      if (count > 0) {
        this.data.members_list[i] = 41 + count * 62
      }
      else {
        this.data.members_list[i] = 0
      }
    }
  },

  nameDialog(e) {
    if (e.detail.index == 1 && this.data.group_name_temp != this.data.name) {
      if (this.data.buttons2[1].loading == false) {
        this.setData({
          available: false,
          unavailable: false,
          alert: '',
          [`buttons2[1].loading`]: true,
        })
        var that = this
        const db = wx.cloud.database()
        db.collection('Groups').where({
          group_name: this.data.group_name_temp
        }).count().then(result => {
          if (result.total != 0) {
            that.setData({
              unavailable: true,
              alert: '*名称不可用',
              [`buttons2[1].loading`]: false,
              namechecking: false
            })
          } else {
            that.setData({
              [`buttons2[1].disabled`]: false,
              available: true
            })
            var data = {
              group_name: this.data.group_name_temp
            }
            this.UpdateGroupInfo(data, this.nameUpdate)
          }
        }).catch(err => {
          that.setData({
            namechecking: false
          })
          wx.showToast({
            title: '网络异常',
            image: '../../../../images/network.png'
          })
        })
      }
    } else {
      this.setData({
        group_name_temp: '',
        showNameDialog: false,
        showNameDialog2: false
      })
    }
  },
  nameUpdate: function (url) {
    this.setData({
      name: this.data.group_name_temp
    })
    this.setData({
      group_name_temp: '',
      showNameDialog: false,
      showNameDialog2: false
    })
  },
  name_focus(e) {
    this.setData({
      [`buttons2[1].disabled`]: true,
      available: false,
      unavailable: false,
      namechecking: false,
      alert: ' '
    })
  },
  name_input(e) {
    this.setData({
      group_name_temp: e.detail.value
    })
  },
  name_blur(e) {
    this.setData({
      group_name_temp: e.detail.value,
      available: false,
      unavailable: false,
      namechecking: (e.detail.value != '' && e.detail.value != this.data.name) ? true : false
    })
    var that = this
    if (e.detail.value != '' && e.detail.value != this.data.name) {
      const db = wx.cloud.database()
      db.collection('Groups').where({
        group_name: e.detail.value
      }).count().then(res => {
        if (res.total != 0) {
          that.setData({
            unavailable: true,
            alert: '*名称不可用'
          })
        } else {
          that.setData({
            [`buttons2[1].disabled`]: false,
            available: true
          })
        }
        that.setData({
          namechecking: false
        })
      }).catch(err => {
        that.setData({
          namechecking: false
        })
        wx.showToast({
          title: '网络异常',
          image: '../../../../images/network.png'
        })
      })
    } else if (e.detail.value == this.data.name) {
      this.setData({
        [`buttons2[1].disabled`]: false
      })
    }
  },

  qqradioChange(e) {
    this.setData({
      qq_type: e.detail.value
    })
    this.setData({
      exist: false,
      unexist: false,
      photochecking: this.data.profile != '' ? true : false,
      alert: ' '
    })
    var that = this
    if (this.data.qq_type == 'qq') {
      var url = 'https://q2.qlogo.cn/headimg_dl?dst_uin=' + this.data.profile + '&spec=0'
    } else {
      var url = 'https://p.qlogo.cn/gh/' + this.data.profile + '/' + this.data.profile + '/0'
    }
    if (this.data.profile != '') {
      this.checkExist(url)
    }
  },
  photoDialog(e) {
    if (this.data.qq_type == 'qq') {
      var url = 'https://q2.qlogo.cn/headimg_dl?dst_uin=' + this.data.profile + '&spec=0'
    } else {
      var url = 'https://p.qlogo.cn/gh/' + this.data.profile + '/' + this.data.profile + '/0'
    }
    if (e.detail.index == 1 && url != this.data.image) {
      if (this.data.buttons2[1].loading == false) {
        var data = {
          group_image: url
        }
        this.UpdateGroupInfo(data, this.photoUpdate, url)
      }
    } else {
      this.setData({
        profile: '',
        showPhotoDialog: false,
        showPhotoDialog2: false
      })
    }
  },
  photoUpdate: function (url) {
    this.setData({
      profile: '',
      image: url,
      showPhotoDialog: false,
      showPhotoDialog2: false
    })
  },
  profile_photo_focus(e) {
    this.setData({
      [`buttons2[1].disabled`]: true,
      exist: false,
      unexist: false,
      photochecking: false,
      alert: ' '
    })
  },
  profile_photo_input(e) {
    this.setData({
      profile: e.detail.value
    })
  },
  profile_photo_blur(e) {
    this.setData({
      profile: e.detail.value,
      exist: false,
      unexist: false
    })
    if (this.data.qq_type == 'qq') {
      var url = 'https://q2.qlogo.cn/headimg_dl?dst_uin=' + this.data.profile + '&spec=0'
    } else {
      var url = 'https://p.qlogo.cn/gh/' + this.data.profile + '/' + this.data.profile + '/0'
    }
    this.setData({
      profile: e.detail.value,
      exist: false,
      unexist: false,
      photochecking: (e.detail.value != '' && url != this.data.image) ? true : false
    })
    if (e.detail.value != '' && url != this.data.image) {
      this.checkExist(url)
    } else if (url == this.data.image) {
      this.setData({
        [`buttons2[1].disabled`]: false
      })
    }
  },
  checkExist: function (url) {
    var that = this
    wx.request({
      url: url,
      success: function (res) {
        if (res.header['X-Info'].indexOf('notexist') != -1) {
          that.setData({
            unexist: true,
            alert: '*输入错误，请检查后重新输入'
          })
        } else {
          that.setData({
            exist: true,
            preview_photo: url,
            [`buttons2[1].disabled`]: false,
          })
        }
        that.setData({
          photochecking: false,
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常',
          image: '../../../../images/network.png'
        })
        that.setData({
          photochecking: false,
        })
      }
    })
  },

  descDialog(e) {
    if (e.detail.index == 1 && e.detail.value != this.data.description) {
      if (this.data.buttons2[1].loading == false) {
        var data = {
          group_description: this.data.group_description_temp
        }
        this.UpdateGroupInfo(data, this.descUpdate)
      }
    } else {
      this.setData({
        group_description_temp: '',
        showDescDialog: false,
        showDescDialog2: false
      })
    }
  },
  descUpdate: function () {
    this.setData({
      description: this.data.group_description_temp
    })
    this.setData({
      group_description_temp: '',
      showDescDialog: false,
      showDescDialog2: false
    })
    var query = wx.createSelectorQuery();
    query.select('#brief').boundingClientRect((rect) => {
      this.data.brief_height = rect.height
    }).exec();
  },
  textarea_input(e) {
    this.setData({
      [`buttons2[1].disabled`]: this.data.textarea_count > 200 ? true : false,
      textarea_count: e.detail.value.length,
      group_description_temp: e.detail.value
    })
  },
  textarea_blur(e) {
    this.setData({
      [`buttons2[1].disabled`]: this.data.textarea_count > 200 ? true : false,
      group_description_temp: e.detail.value
    })
  },

  UpdateGroupInfo(data, subfunction, subparameter = '') {
    this.setData({
      [`buttons2[1].loading`]: true
    })
    var that = this
    wx.cloud.callFunction({
      name: 'SearchGroupsMembers',
      data: {
        id: this.data.group_id,
        method: 'UpdateInfo',
        content: 'info',
        data: data
      },
      success: function (res) {
        if (res.result.status == 'Success') {
          subfunction(subparameter);
          wx.showToast({
            title: '成功',
            icon: 'success',
          })
          getApp().globalData.newgroup = true
        } else {
          wx.showToast({
            title: '失败',
            image: '../../../../images/error.png'
          })
        }
        that.setData({
          [`buttons2[1].loading`]: false
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常',
          image: '../../../../images/network.png'
        })
        that.setData({
          [`buttons2[1].loading`]: false
        })
      }
    })
  },

  search(e) {
    var that = this
    for (var i = 0; i < this.data.members_name_detail.length; i++) {
      this.data.members_name_detail[i].search_member = 0
    }
    this.setData({
      showSearch: !this.data.showSearch,
      members_name_detail: this.data.members_name_detail,
      search_admins_member: 0,
      search_member: 0
    })
    if (this.data.showSearch == false) {
      for (var i = 0; i < this.data.members_detail.length; i++) {
        this.data.members_detail[i].searchHidden = false
      }
      this.RefreshMembersList()
    }
  },
  Searching(e, delay = 300) {
    this.data.search_word = e.detail.value
    var that = this
    setTimeout(function () {
      if (that.data.search_word == e.detail.value || that.data.search_word == '') {
        for (var i = 0; i < that.data.members_name_detail.length; i++) {
          that.data.members_name_detail[i].search_member = 0
        }
        that.data.search_admins_member = 0
        that.data.search_member = 0
        if (that.data.search_word != '') {
          that.gosearch(e.detail.value)
        } else {
          for (var i = 0; i < that.data.members_detail.length; i++) {
            that.data.members_detail[i].searchHidden = false
          }
          that.setData({
            search_admins_member: that.data.search_admins_member,
            search_member: that.data.search_member
          })
          that.RefreshMembersList()
        }
      }
    }, delay)
  },
  gosearch(keyword) {
    for (var i = 0; i < this.data.members_detail.length; i++) {
      if (this.data.members_detail[i].__realname.indexOf(keyword) == -1 && this.data.members_detail[i].__uid.indexOf(keyword) == -1) {
        this.data.members_detail[i].searchHidden = true
        if (this.data.arrange_admin) {
          if (this.data.members_detail[i].admin || this.data.members_detail[i]._openid == this.data.ownership) {
            this.data.search_admins_member++
          } else if (this.data.arrange_mode == 3) {
            var initial = PY.pinyin.getFullChars(this.data.members_detail[i].__realname).slice(0, 1)
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            var flag = (characters.indexOf(initial) == -1) ? 0 : ((characters.indexOf(initial) % 26) + 1)
            this.data.members_name_detail[flag].search_member++
          } else {
            this.data.search_member++
          }
        } else {
          if (this.data.arrange_mode == 3) {
            var initial = PY.pinyin.getFullChars(this.data.members_detail[i].__realname).slice(0, 1)
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            var flag = (characters.indexOf(initial) == -1) ? 0 : ((characters.indexOf(initial) % 26) + 1)
            this.data.members_name_detail[flag].search_member++
          } else {
            this.data.search_member++
          }
        }
      } else {
        this.data.members_detail[i].searchHidden = false
      }
    }
    this.setData({
      search_admins_member: this.data.search_admins_member,
      search_member: this.data.search_member,
    })
    this.RefreshMembersList()
  },
  sort(e) {
    this.setData({
      title: '成员排序',
      groups: [{
        text: '按学号排序' + (this.data.arrange_mode == 1 ? '✔️' : '　'),
        value: 1,
        type: (this.data.arrange_mode == 1 ? 'primary' : '　')
      },
      {
        text: '按姓名排序' + (this.data.arrange_mode == 3 ? '✔️' : '　'),
        value: 3,
        type: (this.data.arrange_mode == 3 ? 'primary' : '　')
      },
      {
        text: '管理员优先' + (this.data.arrange_admin ? '✔️' : '　'),
        value: 5,
        type: (this.data.arrange_admin ? 'primary' : '　')
      },
      ],
    })
    this.setData({
      showActionsheet: true
    })
  },

  ManageTeacher: function () {
    wx.navigateTo({
      url: './Me_Groups_teacher?group_id=' + this.data.group_id + '&navigation_color=' + this.data.navigation_background + '&button_color=' + this.data.type_background
    })
  },

  ManageMembers: function () {
    this.animation_function()
    this.setData({
      manageMembers_mode: true
    })
  },

  ManagePrivacy: function () {
    if (this.data.verified_members_length == 0) {
      wx.navigateTo({
        url: './Me_Groups_privacy?group_id=' + this.data.group_id + '&privacy=' + this.data.privacy + '&navigation_color=' + this.data.navigation_background + '&button_color=' + this.data.type_background
      })
    } else {
      this.setData({
        error: '还有未处理的申请记录',
        error_status: true
      })
    }
  },

  GroupLogs: function () {
    wx.navigateTo({
      url: './Me_Groups_log?group_id=' + this.data.group_id + '&navigation_color=' + this.data.navigation_background + '&button_color=' + this.data.type_background
    })
  },

  delete: function (e) {
    if (this.data.index_delete == -1 && (!this.data.search)) {
      var e_index = e.currentTarget.id.slice(0, e.currentTarget.id.indexOf(' '))
      var t1 = e.currentTarget.id.substring(e.currentTarget.id.indexOf(' ') + 1)
      var e_number = Number(t1.slice(0, t1.indexOf(' ')))
      var e_openid = t1.substring(t1.indexOf(' ') + 1)
      this.setData({
        index_temp: e_index,
        number_temp: e_number,
        openid_temp: e_openid,
        name_temp: this.data.members_detail[e_number].__realname,
        uid_temp: this.data.members_detail[e_number].__uid,
        dialogRemoveMembersShow: true
      })
    }
  },

  ManageAdmins: function () {
    this.animation_function()
    this.setData({
      manageAdmins_mode: true,
      admins_temp: this.data.admins_array
    })
  },

  add: function (e) {
    this.Adminschange(e, this.data.add_index, 'add_index')
  },
  remove: function (e) {
    this.Adminschange(e, this.data.remove_index, 'remove_index')
  },
  Adminschange: function (e, target_var, target_name) {
    if (target_var == -1 && (!this.data.search)) {
      var e_index = e.currentTarget.id.slice(0, e.currentTarget.id.indexOf(' '))
      var t1 = e.currentTarget.id.substring(e.currentTarget.id.indexOf(' ') + 1)
      var e_number = t1.slice(0, t1.indexOf(' '))
      var e_openid = t1.substring(t1.indexOf(' ') + 1)
      this.setData({
        [target_name]: e_number
      })
      this.data.members_detail[e_number].admint = !this.data.members_detail[e_number].admint
      var that = this
      setTimeout(function () {
        that.RefreshMembersList()
        that.setData({
          [target_name]: -1
        })
      }, 300)
      if (target_name == 'add_index') {
        this.data.admins_array.push(e_openid)
      } else if (target_name == 'remove_index') {
        var a_index = this.data.admins_array.indexOf(e_openid)
        this.data.admins_array.splice(a_index, 1)
      }
      this.setData({
        admins_title: (getApp().globalData.currentGroup.group_type == 'associations' ? getApp().globalData.currentGroup.subtype : '班级') + '管理员 (' + this.data.admins_array.length + ')'
      })
    }
  },

  showProfile(e) {
    var systemInfo = wx.getSystemInfoSync()
    var width = systemInfo.windowWidth
    var height = systemInfo.windowHeight
    var x = e.touches[0].clientX
    var y = e.touches[0].clientY
    for (var i = 0; i < this.data.members_detail.length; i++) {
      if (this.data.members_detail[i]._openid == e.currentTarget.id) {
        this.setData({
          profile_left: (x + 310 > width) ? (width - 310) : (x - 40),
          profile_top: (y + 215 > height) ? (height - 185) : (y + 30),
          maskProfile: true,
          userProfile: this.data.members_detail[i]
        })
        break;
      }
    }
  },
  HideMaskProfile: function () {
    this.setData({
      maskProfile: false,
    })
  },

  ManageOwnership: function () {
    this.animation_function()
    this.setData({
      manageOwnership_mode: true
    })
  },

  onwershipChange: function (e) {
    this.setData({
      ownership_index: e.currentTarget.id
    })
  },

  Finish: function () {
    if (!this.data.FinishLoading) {
      var that = this;
      this.setData({
        FinishLoading: true
      })
      if (this.data.manageAdmins_mode) {
        wx.cloud.callFunction({
          name: 'SearchGroupsMembers',
          data: {
            id: this.data.group_id,
            method: 'updateAdmins',
            members: this.data.admins_array
          },
          success: function (result) {
            console.log(result)
            if (result.result.updateStatus == 'Update Admins Success') {
              wx.showToast({
                title: '成功',
                icon: 'success',
              })
              that.animation_home()
              for (var i = 0; i < that.data.members_detail.length; i++) {
                that.data.members_detail[i].admin = that.data.members_detail[i].admint
              }
              that.RefreshMembersList()
              that.admins_sort()
            } else {
              that.setData({
                admins_temp: result.result.admins,
                dialogAdminsShow: true
              })
            }
            that.setData({
              FinishLoading: false
            })
          },
          fail: function (err) {
            that.setData({
              dialogAdminsShow: true
            })
          }
        })
      } else if (this.data.manageMembers_mode && this.data.remove_array != []) {
        wx.cloud.callFunction({
          name: 'SearchGroupsMembers',
          data: {
            id: this.data.group_id,
            method: 'updateMembers',
            members: this.data.remove_array
          },
          success: function (result) {
            console.log(result)
            if (result.result.deleteStatus == 'Update Members Success') {
              wx.showToast({
                title: '更新成功',
                icon: 'success'
              })
              that.animation_home()
              var arr = that.data.remove_index_array.sort()
              for (var i = arr.length - 1; i >= 0; i--) {
                that.data.members_detail.splice(arr[i], 1)
                that.data.members_array.splice(that.data.members_array.indexOf(that.data.remove_array[i]), 1)
              }
              that.data.remove_index_array = []
              that.data.remove_array = []
              that.admins_sort()
            } else {
              that.setData({
                dialogMembersShow: true
              })
            }
          },
          fail: function (err) {
            that.setData({
              dialogMembersShow: true
            })
          }
        })
      } else if (this.data.manageOwnership_mode) {
        this.setData({
          name_temp: this.data.members_detail[this.data.ownership_index].__realname,
          uid_temp: this.data.members_detail[this.data.ownership_index].__uid,
          dialogOwnershipEnsureShow: true
        })
      } else {
        this.animation_home()
      }
    }
  },

  animation_home: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    var move_dis = 0 - this.data.brief_height
    this.animate('#page', [{
      translateY: move_dis,
      ease: 'ease'
    },
    {
      translateY: 0,
      ease: 'ease'
    },
    ], 300, function () {
      this.clearAnimation('#page')
    }.bind(this))
    this.setData({
      manageAdmins_mode: false,
      manageMembers_mode: false,
      manageOwnership_mode: false,
    })
  },

  animation_function: function () {
    this.data.members_list_moving = false
    var move_dis = 0 - this.data.brief_height
    this.selectComponent('#sidebar').sidebar_setselcted(-10)
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.animate('#page', [{
      translateY: 0,
      ease: 'ease'
    },
    {
      translateY: move_dis,
      ease: 'ease'
    },
    ], 100, function () {
      this.setData({
        toView: 'functions'
      }, function () {
        this.data.members_list_moving = true
      }.bind(this))
    }.bind(this))
  },

  Cancel: function () {
    this.setData({
      navigation_loading: true
    })
    var e2 = {
      detail: {
        index: 0
      }
    }
    if (this.data.manageAdmins_mode) {
      this.tapDialogAdminsButton(e2)
    } else if (this.data.manageMembers_mode && this.data.remove_array != []) {
      this.tapDialogMembersButton(e2)
    } else if (this.data.manageOwnership_mode) {
      this.setData({
        ownership_index: -1
      })
    }
    this.selectComponent('#sidebar').sidebar_setselcted(-10)
    //this.getGroupMemberInfo(this.data.group_id, 'get')
    this.animation_home()
    this.setData({
      navigation_loading: false
    })
  },

  DockRedirect(e) {
    if (this.data.group_id != e.currentTarget.id) {
      var groups_array = getApp().globalData.groups_array
      for (var i = 0; i < groups_array.length; i++) {
        if (e.currentTarget.id == groups_array[i]._id) {
          getApp().globalData.currentGroup = groups_array[i]
        }
      }
      wx.redirectTo({
        url: './Me_Groups_details?group_id=' + e.currentTarget.id,
      })
    }
  }

})