// miniprogram/pages/Todos/Application/Todos_submit.js
Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
    uid: '',
    realname: '',
    phonenumber: '',
    mailbox: '',
    qqid: '',
    wxid: '',
    timeS: '单击此处选择',
    timeE: '单击此处选择',
    TimeS_Index: [0, 0],
    TimeE_Index: [0, 0],
    Time_Array: [['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'], ['第01节', '第02节', '第03节', '第04节', '第05节', '第06节', '第07节', '第08节', '第09节', '第10节', '第11节', '第12节', '第13节', '第14节']],
    schools: '校本部',
    school_array: ['校本部', '沙河校区'],
    school_index: 0,
    types: '多媒体教室',
    type_array: ['多媒体教室', '实验室', '计算机房', '素描教室', '体育场', '听力教室', '艺术类专用', '语音室', '制图室'],
    Type_array: [['多媒体教室', '实验室', '计算机房', '素描教室', '体育场', '听力教室', '艺术类专用', '语音室', '制图室'], ['多媒体教室', '实验室', '高清录播教室', '互动教室', '计算机房', '素描教室', '体育场', '同声传译实验室', '语音室', '制图室']],
    type_index: 0,
    volumes: '40人及以下',
    volume_array: ['40人及以下', '40-60人', '60-100人', '100-150人', '150-200人', '200-250人', '250人及以上'],
    Volume_array: [['40人及以下', '40-60人', '60-100人', '100-150人', '150-200人', '200-250人', '250人及以上'], ['20人及以下', '20-30人', '30-40人', '40-50人', '50人及以上'], ['65人及以下'], ['30人'], ['400人'], ['48人及以下'], ['100人及以下'], ['48人及以下'], ['80人及以下'], ['50人及以下', '50-120人', '120-130人', '130-160人', '190-210人', '210-230人', '400人'], ['30人及以下', '30-40人', '40-80人', '300人'], ['69人'], ['31人'], ['78人及以下'], ['120人及以下'], ['800人'], ['64人'], ['65人及以下'], ['77人']],
    volume_index: 0,
    multimedia: '是',
    multimedia_array: ['是', '否'],
    multimedia_index: 0,
    marginT: 10,
    weui_h: "weui-article__h1",
    SubmitDisabled: true,
    SubmitLoading: false,
    groups: '单击此处选择',
    group_index: 0,
    textarea_count: 0,
    time_footer: 'unknown',
    group_array: [],
    group_id: [],
    error: '',
    error_status: false,
    name: '',
    textarea: ''
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
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
    var gd = getApp().globalData
    this.setData({
      realname: gd.realname,
      uid: gd.uid
    })
    var that = this
    if (getApp().globalData.identity == 'student') {
      wx.getStorage({
        key: 'detailedInfo',
        success: function (re) {
          that.setData({
            phonenumber: re.data.phonenumber,
            mailbox: re.data.mailbox,
            qqid: re.data.qqid,
            wxid: re.data.wxid,
          })
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
            getApp().globalData.phonenumber = re.data.phonenumber
            getApp().globalData.mailbox = re.data.mailbox
            getApp().globalData.qqid = re.data.qqid
            getApp().globalData.wxid = re.data.wxid
          }).catch(err => {
            wx.showToast({
              title: '网络异常',
              image: '../../../images/error.png'
            })
          })
        }
      })
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('Groups').where(_.or([{ manage_ownership: getApp().globalData.openid }, { manage_admins: getApp().globalData.openid }]))
        .get().then(res => {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].manage_teacher != undefined && res.data[i].manage_teacher.length > 0) {
              this.data.group_array.push(res.data[i].group_name)
              this.data.group_id.push(res.data[i]._id)
            }
          }
          this.setData({
            group_array: this.data.group_array
          })
        })
    }
    /*************
     * 为日期数组获取时间
     *************/
    var date = new Date()
    var week = ['日', '一', '二', '三', '四', '五', '六']
    for (var i = 0; i < 7; i++) {
      var date2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i)
      this.data.Time_Array[0][i] = date2.getMonth() + 1 + '月' + (date2.getDate()) + '日 周' + week[date2.getDay()]
    }
    this.setData({
      Time_Array: this.data.Time_Array
    })
  },
  //生命周期函数--监听页面显示
  onShow: function () {
    /*************
     * 获取用户信息
     *************/
    if (getApp().globalData.phonenumber != undefined) {
      var gd = getApp().globalData
      this.setData({
        phonenumber: gd.phonenumber,
        mailbox: gd.mailbox,
        qqid: gd.qqid,
        wxid: gd.wxid
      })
    }
  },

  /*************************
   * 选择器区
   * 用户填写个人信息
   *************************/
  bindSchoolPickerChange: function (e) {
    this.setData({
      school_index: e.detail.value,
      schools: this.data.school_array[e.detail.value],
      type_array: this.data.Type_array[e.detail.value],
      volume_array: this.data.Volume_array[parseInt(e.detail.value * 9)],
      types: this.data.Type_array[e.detail.value][0],
      volumes: this.data.Volume_array[parseInt(e.detail.value * 9)][0],
      type_index: 0,
      volume_index: 0
    })
  },
  bindTypePickerChange: function (e) {
    this.setData({
      type_index: e.detail.value,
      types: this.data.type_array[e.detail.value],
      volume_array: this.data.Volume_array[parseInt(this.data.school_index * 9) + parseInt(e.detail.value)],
      volume_index: 0,
      volumes: this.data.Volume_array[parseInt(this.data.school_index * 9) + parseInt(e.detail.value)][0],
    })
  },
  bindVolumePickerChange: function (e) {
    this.setData({
      volume_index: e.detail.value,
      volumes: this.data.volume_array[e.detail.value]
    })
  },
  bindmultimediaPickerChange: function (e) {
    this.setData({
      multimedia_index: e.detail.value,
      multimedia: this.data.multimedia_array[e.detail.value]
    })
  },
  bindTimeStartMultiPickerChange: function (e) {
    var timeE = this.data.timeE
    var TimeE_Index = this.data.TimeE_Index
    if (timeE != '单击此处选择' && (e.detail.value[0] > TimeE_Index[0] || e.detail.value[1] > TimeE_Index[1])) {
      this.data.time_footer = 'reject'
    }
    else if (timeE != '单击此处选择') {
      this.data.time_footer = 'accept'
    }
    else {
      this.data.time_footer = 'unknown'
    }
    this.setData({
      TimeS_Index: e.detail.value,
      timeS: this.data.Time_Array[0][e.detail.value[0]] + ' ' + this.data.Time_Array[1][e.detail.value[1]],
      time_footer: this.data.time_footer
    })
    this.checkInfo()
  },
  bindTimeEndMultiPickerChange: function (e) {
    var timeS = this.data.timeS
    var TimeS_Index = this.data.TimeS_Index
    if (timeS != '单击此处选择' && (e.detail.value[0] < TimeS_Index[0] || e.detail.value[1] < TimeS_Index[1])) {
      this.data.time_footer = 'reject'
    }
    else if (timeS != '单击此处选择') {
      this.data.time_footer = 'accept'
    }
    else {
      this.data.time_footer = 'unknown'
    }
    this.setData({
      TimeE_Index: e.detail.value,
      timeE: this.data.Time_Array[0][e.detail.value[0]] + ' ' + this.data.Time_Array[1][e.detail.value[1]],
      time_footer: this.data.time_footer
    })
    this.checkInfo()
  },
  name_input: function (e) {
    this.data.name = e.detail.value
    this.checkInfo()
  },
  name_blur: function (e) {
    this.data.name = e.detail.value
    this.checkInfo()
  },
  textarea_input: function (e) {
    this.setData({
      textarea_count: e.detail.value.length
    })
    this.data.textarea = e.detail.value
    this.checkInfo()
  },
  textarea_blur: function (e) {
    this.setData({
      textarea_count: e.detail.value.length
    })
    this.data.textarea = e.detail.value
    this.checkInfo()
  },
  bindGroupPickerChange: function (e) {
    this.setData({
      group_index: e.detail.value,
      groups: this.data.group_array[e.detail.value]
    })
    this.checkInfo()
  },
  checkInfo: function () {
    if (this.data.timeS == '单击此处选择' || this.data.timeE == '单击此处选择' || this.data.groups == '单击此处选择' || this.data.time_footer != 'accept' || this.data.name == '' || this.data.phonenumber == '') {
      if (this.data.SubmitDisabled == false) {
        this.setData({
          SubmitDisabled: true
        })
      }
      return false
    } else {
      if (this.data.SubmitDisabled == true) {
        this.setData({
          SubmitDisabled: false
        })
      }
      return true
    }
  },

  /*************************
   * 按钮区
   * 用户提交验证
   *************************/
  Submit: function () {
    if (this.checkInfo() && (!this.data.SubmitLoading)) {
      this.setData({
        SubmitLoading: true
      })
      var volume = this.data.volumes
      volume = volume.replace(/人/, "")
      var min_num = 0
      var max_num = 1000
      if (volume.indexOf('-') != -1) {
        min_num = parseInt(volume.substring(0, volume.indexOf('-')))
        max_num = parseInt(volume.substring(volume.indexOf('-') + 1))
      }
      else if (volume.indexOf('以下') != -1) {
        max_num = parseInt(volume.substring(0, volume.indexOf('以')))
      }
      else if (volume.indexOf('以上') != -1) {
        min_num = parseInt(volume.substring(0, volume.indexOf('以')))
      }
      else {
        max_num = parseInt(volume)
      }
      var date_start = this.data.Time_Array[0][this.data.TimeS_Index[0]]
      var date_end = this.data.Time_Array[0][this.data.TimeE_Index[0]]
      var week = ['一', '二', '三', '四', '五', '六', '日']
      date_start = date_start.substring(date_start.indexOf('周') + 1)
      date_end = date_end.substring(date_end.indexOf('周') + 1)
      var date = new Date(2020, 1, 23)
      var date2 = new Date()
      var week_s = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate() + this.data.TimeS_Index[0])
      var week_e = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate() + this.data.TimeE_Index[0])
      var week_start = Math.ceil((week_s - date) / 86400000 / 7)
      var week_end = Math.ceil((week_e - date) / 86400000 / 7)
      const db = wx.cloud.database()
      var data = {
        classroom_school: this.data.schools,
        classroom_type: this.data.types,
        classroom_volume_min: min_num,
        classroom_volume_max: max_num,
        classroom_volume: this.data.volumes,
        classroom_multimedia: this.data.multimedia,
        classroom: '等待分配',
        time_week_start: week_start,
        time_week_end: week_end,
        time_date_start: week.indexOf(date_start) + 1,
        time_date_end: week.indexOf(date_end) + 1,
        time_section_start: this.data.TimeS_Index[1] + 1,
        time_section_end: this.data.TimeE_Index[1] + 1,
        time_start: this.data.timeS,
        time_end: this.data.timeE,
        activity_person: getApp().globalData.openid,
        activity_group: this.data.group_id[this.data.group_index],
        activity_name: this.data.name,
        activity_remarks: this.data.textarea,
        status: 'waiting',
        reason: ''
      }
      db.collection('ActivityApplication').add({
        data: data
      }).then(res => {
        this.setData({
          SubmitLoading: false
        })
        getApp().globalData.changed_todos = {
          _id: res._id,
          new_status: 'waiting',
          data: {
            activity_group: this.data.groups,
            activity_name: this.data.name,
            classroom_school: this.data.schools,
            classroom_type: this.data.types,
            classroom_volume: this.data.volumes,
            time_start: this.data.timeS,
            time_end: this.data.timeE
          }
        }
        wx.cloud.callFunction({
          name: 'MessagePushService',
          data: {
            method: 'waiting',
            group_id: this.data.group_id[this.data.group_index],
            template_id: '1ZBtx0qkvbDahDprSqL93sQhW-_iBQTuoLyAiSE0cp0',
            page_path: 'index',
            push_data: {
              name1: { value: this.data.realname.substring(0, 10) },
              thing2: { value: (this.data.schools + ' ' + this.data.types + '(' + this.data.volumes + ')').substring(0, 20) },
              date3: { value: '2020-' + this.data.timeS.substring(0, this.data.timeS.indexOf('月')) + '-' + this.data.timeS.substring(this.data.timeS.indexOf('月') + 1, this.data.timeS.indexOf('日')) },
              thing5: { value: this.data.name.substring(0, 20) },
              thing7: { value: this.data.textarea == '' ? '无' : this.data.textarea.substring(0, 20) }
            }
          },
          success: result => {
            console.log(result)
          }
        })
        wx.redirectTo({
          url: '../Result/Todos_result?_id=' + res._id + '&data=' + JSON.stringify(data),
        })
      }).catch(err => {
        this.setData({
          error: '网络异常',
          error_status: true,
          SubmitLoading: false
        })
      })
    }
    else if (!this.data.SubmitLoading) {
      this.setData({
        error: '请检查信息是否填写完整',
        error_status: true
      })
    }
  },

  ResetInput: function () {
    this.setData({
      schools: '校本部',
      school_index: 0,
      types: '多媒体教室',
      type_array: ['多媒体教室', '实验室', '计算机房', '素描教室', '体育场', '听力教室', '艺术类专用', '语音室', '制图室'],
      type_index: 0,
      volumes: '40人及以下',
      volume_array: ['40人及以下', '40-60人', '60-100人', '100-150人', '150-200人', '200-250人', '250人以上'],
      volume_index: 0,
      multimedia: '是',
      multimedia_index: 0,
      timeS: '单击此处选择',
      timeE: '单击此处选择',
      TimeS_index: [0, 0],
      TimeE_Index: [0, 0],
      groups: '单击此处选择',
      group_index: 0,
      textarea_count: 0,
      SubmitDisabled: true,
      time_footer: 'unknown'
    })
    this.data.name = ''
    this.data.textarea = ''
  },
  GoBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  GoToInfo: function () {
    wx.navigateTo({ url: '../../Me/UserInfo/Contacts/Me_Info_con' })
  }

})