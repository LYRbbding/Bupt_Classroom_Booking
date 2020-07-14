// miniprogram/pages/index/console.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttons: [{
      id: '/pages/Me/IdentityAuthentication/Authorize/Me_Auth_auth',
      text: 'Me_Auth_auth'
    }, {
      id: '/pages/Me/IdentityAuthentication/Initialization/Me_Auth_init',
      text: 'Me_Auth_init'
    }, {
      id: '/pages/Me/IdentityAuthentication/Login/Me_Auth_login',
      text: 'Me_Auth_login'
    }, {
      id: '/pages/Me/MyGroups/AddGroup/Me_Groups_add',
      text: 'Me_Groups_add'
    }, {
      id: '/pages/Me/MyGroups/CreateGroup/Me_Groups_create',
      text: 'Me_Groups_create'
    }, {
      id: '/pages/Me/MyGroups/GroupDetails/Me_Groups_details',
      text: 'Me_Groups_details'
    }, {
      id: '/pages/Me/MyGroups/GroupDetails/Me_Groups_log',
      text: 'Me_Groups_log'
    }, {
      id: '/pages/Me/MyGroups/GroupDetails/Me_Groups_privacy',
      text: 'Me_Groups_privacy'
    }, {
      id: '/pages/Me/MyGroups/Me_mygroups',
      text: 'Me_mygroups'
    }, {
      id: '/pages/Me/Settings/Me_settings',
      text: 'Me_settings'
    }, {
      id: '/pages/Me/Settings/About/Me_Settings_about',
      text: 'Me_Settings_about'
    }, {
      id: '/pages/Me/UserInfo/Avatar/Me_Info_ava',
      text: 'Me_Info_ava'
    }, {
      id: '/pages/Me/UserInfo/Contacts/Me_Info_con',
      text: 'Me_Info_con'
    }, {
      id: '/pages/Me/UserInfo/UserInfo/Me_Info_info',
      text: 'Me_Info_info'
    }, {
      id: '/pages/Me/UserInfo/Me_userinfo',
      text: 'Me_userinfo'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let query = async function () {
      const db = wx.cloud.database()
      const _ = db.command
      var campus = '沙河校区'   //校区
      var classroom = ['N103', 'N105']  //教室
      var date_min = 1        //星期起始，范围1(周一)-7(周日)
      var date_max = 7        //星期终止，范围1(周一)-7(周日)
      var section_min = 1     //节次起始，范围1-14
      var section_max = 14    //节次终止，范围1-14
      var page_limit = 100    //云函数取100，小程序端取20
      var start = 0           //已经查找过的记录数量
      var query_result = []   //储存查询结果的数组
      const weeks = ['01', '02', '03']  //查询的星期范围
      var week_str = weeks[0]   //星期范围的正则表达式字符串及其拼接
      for (var i = 1; i < weeks.length; i++) {
        week_str = week_str + '|' + weeks[i]
      }
      var count = 0           //当前页面返回值数量
      do {
        var result_temp = await db.collection('Curriculum').where({
          campus: campus,
          classroom: _.in(classroom),
          week_search: db.RegExp({
            regexp: week_str
          }),
          date_search: _.or(_.lte(date_max), _.gte(date_min)),//_.or表示或者关系，_.lte表示小于等于，_.gte表示大于等于
          section_search: _.or(_.lte(section_max), _.gte(section_min))
        }).skip(start).get().then(res => { return res.data })
        count = result_temp.length  //更新当前页面记录数量
        start = start + page_limit  //更新已经查询的记录数量
        query_result = query_result.concat(result_temp) //查询结果数组拼合
      } while (count >= page_limit)   //查询终止条件
      console.log(query_result)     //显示查询结果
    }
    //query()
  },

  Goto(e) {
    console.log(e)
    wx.navigateTo({
      url: e.currentTarget.id
    })
  }
})