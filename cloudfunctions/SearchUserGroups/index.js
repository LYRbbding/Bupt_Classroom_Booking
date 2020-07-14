// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'bupt-classroom-booking' //cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const uid = event.uid
  const method = event.method
  const db = cloud.database()
  const _ = db.command
  const color_group = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#f1c40f", "#e67e22", "#e74c3c"]
  var verification = false
  var result = 'Fail'
  try {
    var openid = wxContext.OPENID
  } catch (e) {
    return {
      result
    }
  }
  var infos = await db.collection('UserRelationship').where({
    _openid: openid
  }).field({
    identity: true,
    uid: true
  }).get()
    .then(function(res){
      return res.data[0]
    })
    .catch(function (err) {
      return 'Fail'
    })
  var match = {}
  try{
    if(infos.identity == 'student'){
      match = {
        members: _.elemMatch(_.eq(openid))
      }
    }
    else {
      match = {
        manage_teacher: _.elemMatch(_.eq(openid))
      }
    }
  } catch (e){
    return { result }
  }
  if (method == 'checkInvitation'){
    var groups = await db.collection('TeacherInfo').where({
      __uid: infos.uid
    }).field({
      group_invite: true,
    }).get()
      .then(res => {
        return res.data[0].group_invite
      })
      .catch(err => {
        return 'Fail'
      })
    try{
      var groups_info = await db.collection('Groups').where({
        _id: _.in(groups)
      }).field({
        group_description: true,
        group_image: true,
        group_name: true,
        group_type: true,
        subtype: true,
        manage_ownership: true
      }).get()
        .then(res => {
          return res.data
        })
        .catch(err => {
          return 'Fail'
        })
      var groups_count = groups_info.length
    } catch (e){
      return { result }
    }
    var ownership = []
    for (var i = 0; i < groups_count; i++) {
      if (typeof(groups_info[i].group_image) === 'undefined'|| groups_info[i].group_image == '') {
        groups_info[i].group_image = '/images/group.png'
        groups_info[i].group_image_text = groups_info[i].group_name.substring(0, 1)
        groups_info[i].group_image_color = color_group[Number(groups_info[i].group_name.charCodeAt(0) % 7)]
      } else if (groups_info[i].group_image != '/images/group.png') {
        groups_info[i].group_image = groups_info[i].group_image.slice(0, -1) + '100'
      }
      else {
        groups_info[i].group_image_text = groups_info[i].group_name.substring(0, 1)
        groups_info[i].group_image_color = color_group[Number(groups_info[i].group_name.charCodeAt(0) % 7)]
      }
      ownership.push(groups_info[i].manage_ownership)
    }
    var ownership_info = await db.collection('StudentInfo').where({
      _openid: _.in(ownership)
    }).field({
      __realname: true,
      __uid: true,
      _openid: true,
      info_classes: true,
      info_schools: true
    }).get()
      .then(res => {
        return res.data
      })
      .catch(err => {
        return 'Fail'
      })
    return {groups_info,ownership_info}
  }
  else {
    var group_pro = []
    var groups_array = []
    var group_res = []
    group_pro = await db.collection('Groups').where(match)
      .field({
        manage_admins: false,
        manage_ownership: false,
        manage_teacher: false
      }).get()
      .then(function(res) {
        return res.data
      })
      .catch(function(err) {
        return 'Fail'
      })
    if (group_pro == 'Fail') {
      return {
        result
      }
    }
    if (!group_pro.length) {
      verification = false;
      return {
        verification,
        groups_array,
        group_res
      }
    }
    group_res = group_pro.sort(function(a, b) {
      if (a.group_type == b.group_type) {
        return a.group_name < b.group_name ? -1 : 1
      } else {
        return a.group_type < b.group_type ? -1 : 1
      }
    })
    for (var i = 0; i < group_res.length; i++) {
      groups_array.push(group_res[i]._id)
    }
    result = 'success'
    for (var i = 0; i < group_res.length; i++) {
      if (typeof(group_res[i].group_image) === 'undefined'|| group_res[i].group_image == '') {
        group_res[i].group_image = '/images/group.png'
        group_res[i].group_image_text = group_res[i].group_name.substring(0, 1)
        group_res[i].group_image_color = color_group[Number(group_res[i].group_name.charCodeAt(0) % 7)]
      } else if (group_res[i].group_image != '/images/group.png') {
        group_res[i].group_image = group_res[i].group_image.slice(0, -1) + '100'
      }
      else {
        group_res[i].group_image_text = group_res[i].group_name.substring(0, 1)
        group_res[i].group_image_color = color_group[Number(group_res[i].group_name.charCodeAt(0) % 7)]
      }
    }
    return {
      result,
      verification,
      groups_array,
      group_res
    }
  }
}