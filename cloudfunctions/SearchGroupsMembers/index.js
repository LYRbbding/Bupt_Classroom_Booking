// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'bupt-classroom-booking' //cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const id = event.id
  const method = event.method
  const db = cloud.database()
  const _ = db.command
  const color_group = ["#fc5c65", "#eb3b5a", "#fd9644", "#fa8231", "#fed330", "#f7b731", "#26de81", "#20bf6b", "#2bcbba", "#0fb9b1", "#45aaf2", "#2d98da", "#4b7bec", "#3867d6", "#a55eea", "#8854d0"]
  const color_group2 = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#f1c40f", "#e67e22", "#e74c3c"]
  var result = 'Fail'
  try {
    /*************
     * 方法：获取操作者OPENID
     * 功能：判断是否传入操作者OPENID，如果没有传入则直接终止程序运行
     *************/
    var openid = wxContext.OPENID
  } catch (e) {
    return {
      result
    }
  }
  if (method == 'create') {
    /*************
     * 方法：创建群组
     * 功能：判断群组名称是否可用，并写入数据库
     *************/
    var available = await db.collection('Groups').where({
        group_name: event.data.group_name
      }).count()
      .then(function(res) {
        return res.total
      })
      .catch(function(err) {
        return 'Fail'
      })
    if (available == 'Fail' || available != 0) {
      return {
        available
      }
    } else {
      var data = event.data
      data.manage_ownership = openid
      data.members = [openid]
      result = await db.collection('Groups').add({
          data: data
        }).then(function(res) {
          return res
        })
        .catch(function(err) {
          return err
        })
      if (result._id != undefined) {
        return {
          result
        }
      } else {
        result = 'Fail'
        return {
          result
        }
      }
    }
  } else if (method == 'add') {
    /*************
     * 方法：扫码加入
     * 功能：获取群组信息，并反馈给用户
     *************/
    var result = await db.collection('Groups').doc(id).field({
        group_description: true,
        group_image: true,
        group_name: true,
        group_type: true,
        subtype: true,
        members: true,
        verified_members: true,
        privacy: true
      }).get()
      .then(function(res) {
        return res.data
      })
      .catch(function(err) {
        return 'Fail'
      })
    if (result.members != undefined) {
      if (typeof (result.group_image) === 'undefined' || result.group_image == '') {
        result.group_image = '/images/group.png'
        result.group_image_text = result.group_name.substring(0, 1)
        result.group_image_color = color_group2[Number(result.group_name.charCodeAt(0) % 7)]
      } else if (result.group_image == '/images/group.png') {
        result.group_image_text = result.group_name.substring(0, 1)
        result.group_image_color = color_group2[Number(result.group_name.charCodeAt(0) % 7)]
      }
      if (result.members.includes(openid)) {
        var getin = true
        return {
          getin,
          result
        }
      } else {
        return {
          result
        }
      }
    } else {
      return {
        result
      }
    }
  } else if (method == 'addMembers') {
    /*************
     * 方法：确认进入群组
     * 功能：用户确认进入群组
     *************/
    var result = await db.collection('Groups').doc(id).field({
      members: true,
      verified_members: true,
      privacy: true
    }).get()
      .then(function (res) {
        return res.data
      })
      .catch(function (err) {
        return 'Fail'
      })
    if (result.privacy != undefined && (!(result.members.includes(openid) || result.verified_members.includes(openid)))) {
      if (result.privacy == '00' || result.privacy == '10'){
        var add_data = {
          members: _.addToSet(openid)
        }
        var success_return = 'Add Members Success'
      }
      else {
        var add_data = {
          verified_members: _.addToSet(openid)
        }
        var success_return = 'Wait Approval Success'
      }
      var addresult = await db.collection('Groups').doc(id).update({
        data: add_data
      }).then(function (res) {
        return success_return
      })
        .catch(function (err) {
          return 'Fail'
        })
      if (addresult == success_return) {
        result = 'Success'
        addStatus = addresult
        return {
          result,
          addStatus
        }
      } else {
        addStatus = 'Fail'
        return {
          result,
          addStatus
        }
      }
    } else {
      if (result.members.includes(openid)){
        var addStatus = 'Add Members Success'
      }
      else if (result.verified_members.includes(openid)){
        var addStatus = 'Wait Approval Success'
      }
      else{
        var addStatus = 'Fail'
      }
      result = (result.privacy == undefined ? 'Fail' : 'Success')
      return {
        result,
        addStatus
      }
    }
  } else if (method == 'approveMembers') {
    /*************
     * 方法：审批进入群组
     * 功能：管理员审批待审核用户
     *************/
    var status = await db.collection('Groups').doc(id).update({
      data: {
        verified_members: _.pull(_.in(event.members))
      }
    }).then(function (res) {
      return 'Success'
    })
      .catch(function (err) {
        return 'Fail'
      })
    if (status == 'Success' && event.way == 'accept'){
      var accept_status = await db.collection('Groups').doc(id).update({
        data: {
          members: _.addToSet({$each:event.members})
        }
      }).then(function (res) {
        return 'Success'
      })
        .catch(function (err) {
          return 'Fail'
        })
    }
    if (accept_status == 'Fail'){
      status = 'Fail'
    }
    return { status }
  } else if (method == 'invitationHandler') {
    /*************
     * 方法：教师处理邀请
     * 功能：教师接受团体邀请或拒绝团体邀请
     *************/
    try {
      if(event.way == 'accept'){
        var status = await db.collection('Groups').doc(id).update({
          data: {
            manage_teacher: _.addToSet(openid)
          }
        }).then(function (res) {
          return 'Success'
        }).catch(function (err) {
            return 'Fail'
          })
      }
    } catch (e) {
      var status = 'Fail'
      return {status}
    }
    var status = await db.collection('TeacherInfo').where({
      __uid: event.uid
    }).update({
      data: {
        group_invite: _.pull(id)
      }
    }).then(function(res) {
      return 'Success'
    })
    .catch(function(err) {
      return 'Fail'
    })
    return {
      status
    }
  } else {
    var verification = true
    var member_fun = []
    var member_pro = []
    var member_ver = []
    var teacher_lis = []
    var admins_mode = 0
    var result = await db.collection('Groups').doc(id).field({
        members: true,
        manage_admins: true,
        manage_ownership: true,
        group_description: true,
        privacy: true,
        verified_members:true,
        manage_teacher:true
      }).get()
      .then(function(res) {
        return res.data
      })
      .catch(function(err) {
        return err
      })
    var members_array = (result.members == undefined ? [] : result.members)
    var verified_members = (result.verified_members == undefined ? [] : result.verified_members)
    var teachers_list = (result.manage_teacher == undefined ? [] : result.manage_teacher)
    var admins = (result.manage_admins == undefined ? [] : result.manage_admins)
    var ownership = result.manage_ownership
    var group_description = result.group_description
    try {
      var privacy = result.privacy
    } catch (e) {
      var privacy = '00'
    }
    try {
      var openid = wxContext.OPENID
      if (openid == ownership) {
        admins_mode = 10
      } else if (admins.includes(openid)) {
        admins_mode = 5
      }
    } catch (e) {
      admins_mode = -1
    }
    if (method == 'UpdateInfo') {
      /*************
       * 方法：更新群组信息
       * 功能：管理员更新群组信息
       *************/
      if (event.content == 'ownership' && admins_mode == 10) {
        var status = await db.collection('Groups').doc(id).update({
            data: event.data
          })
          .then(function(res) {
            return 'Success'
          })
          .catch(function(err) {
            return 'Fail'
          })
        return {
          status
        }
      } else if (event.content == 'ownership' ||admins_mode < 5) {
        var status = 'Fail'
        return {
          status
        }
      } else {
        var status = await db.collection('Groups').doc(id).update({
            data: event.data
          })
          .then(function(res) {
            return 'Success'
          })
          .catch(function(err) {
            return 'Fail'
          })
        return {
          status
        }
      }
    } else if (method == 'updateAdmins') {
      /*************
       * 方法：更新管理员信息
       * 功能：判断更新操作是否合法，如果合法完成写入更新
       *************/
      if (admins_mode == 10 && (!event.members.includes(ownership))) {
        var updateStatus = await db.collection('Groups').doc(id).update({
            data: {
              manage_admins: _.set(event.members)
            }
          }).then(function(res) {
            return 'Update Admins Success'
          })
          .catch(function(err) {
            return 'Update Admins Fail'
          })
        if (updateStatus == 'Update Admins Success') {
          return {
            updateStatus
          }
        } else {
          return {
            updateStatus,
            admins
          }
        }
      } else {
        var updateStatus = 'Unauthorized.'
        return {
          updateStatus
        }
      }
    } else if (method == 'updateMembers') {
      /*************
       * 方法：移除用户
       * 功能：判断更新操作是否合法，如果合法完成写入更新
       *************/
      var members = event.members
      var status = true
      if (admins_mode == 5) {
        for (var i = 0; i < members.length; i++) {
          if (admins.include(members[i])) {
            status = false
            break;
          }
        }
      }
      if (status && admins_mode >= 5 && (!members.includes(ownership))) {
        var deleteStatus = await db.collection('Groups').doc(id).update({
            data: {
              members: _.pull(_.in(event.members))
            }
          }).then(function(res) {
            return 'Update Members Success'
          })
          .catch(function(err) {
            return 'Update Members Fail'
          })
        var deleteStatus2 = await db.collection('Groups').doc(id).update({
            data: {
              manage_admins: _.pull(_.in(event.members))
            }
          }).then(function(res) {
            return 'Update Members Success'
          })
          .catch(function(err) {
            return 'Update Members Fail'
          })
        if (deleteStatus == 'Update Members Success' && deleteStatus2 == 'Update Members Success') {
          return {
            deleteStatus
          }
        } else {
          return {
            deleteStatus,
            members_array
          }
        }
      } else {
        var updateStatus = 'Unauthorized.'
        return {
          updateStatus
        }
      }
    } else if (method == 'exit') {
      /*************
       * 方法：退出团体
       * 功能：退出团体，或者同时解散该团体
       *************/
      if (admins_mode == 10) {
        var status = await db.collection('Groups').doc(id).remove()
          .then(function(res) {
            return 'Delete Success'
          })
          .catch(function(err) {
            return 'Fail'
          })
      } else {
        var status = await db.collection('Groups').doc(id).update({
            data: {
              members: _.pull(openid),
              manage_teacher: _.pull(openid)
            }
          }).then(function(res) {
            return 'Exit Success'
          })
          .catch(function(err) {
            return 'Fail'
          })
        if (status != 'Fail' && admins_mode == 5) {
          var status2 = await db.collection('Groups').doc(id).update({
              data: {
                manage_admins: _.pull(openid)
              }
            }).then(function(res) {
              return 'Exit Success'
            })
            .catch(function(err) {
              return 'Fail'
            })
          if (status2 == 'Fail') {
            status = 'Fail'
          }
        }
      }
      return {
        status
      }
    } else if (method == 'checkverified') {
      /*************
       * 方法：获取待批准成员名单
       * 功能：获取待批准成员信息，并返回客户端
       *************/
      var count = Math.ceil(verified_members.length / 100)
      for (var i = 0; i < count; i++) {
        member_ver.push.apply(member_ver, await db.collection('UserRelationship').where({
          _openid: _.in(verified_members)
        }).field({
          _openid: true,
          realname: true,
          uid: true,
          department: true
        }).skip(i * 100)
          .limit(100)
          .get().then(function (res) {
            return res.data
          }))
      }
      return {
        member_ver
      }
    } else if (method == 'checkteacher') {
      /*************
       * 方法：获取教师列表
       * 功能：获取教师列表信息，并返回给用户
       *************/
      var count = Math.ceil(teachers_list.length / 100)
      for (var i = 0; i < count; i++) {
        teacher_lis.push.apply(teacher_lis, await db.collection('UserRelationship').where({
          _openid: _.in(teachers_list)
        }).field({
          _openid: true,
          realname: true,
          department: true,
          post: true,
          avatarUrl: true
        }).skip(i * 100)
          .limit(100)
          .get().then(function (res) {
            return res.data
          }))
      }
      return {
        teacher_lis
      }
    } else if (method == 'manageteacher') {
      /*************
       * 方法：管理教师信息
       * 功能：按照用户的要求增加或删除教师
       *************/
      if(admins_mode<5){
        var status = "unauthorized"
        return {status}
      }
      if(event.content == 'add'){
        var status = await db.collection('TeacherInfo').doc(event.person).update({
          data: {
            group_invite: _.addToSet(id)
          }
        }).then(function (res) {
          return 'Success'
        }).catch(function (err) {
            return 'Fail'
          })
      }
      else {
        var status = await db.collection('Groups').doc(id).update({
          data: {
            manage_teacher: _.pull(event.person)
          }
        }).then(function(res) {
          return 'Success'
        })
        .catch(function(err) {
          return 'Fail'
        })
      }
      return {
        status
      }
    } else {
      /*************
       * 方法：获取用户信息
       * 功能：获取用户信息并传回客户端
       *************/
      var count = Math.ceil(members_array.length / 100)
      for (var i = 0; i < count; i++) {
        member_pro.push.apply(member_pro, await db.collection('StudentInfo').where({
            _openid: _.in(members_array)
          }).field({
            _openid: true,
            __realname: true,
            __uid: true,
            _avatarUrl: true,
            info_classes: true,
            info_schools: true,
            info_specialities: true,
            info_gender: true
          }).skip(i * 100)
          .limit(100)
          .get().then(function(res) {
            return res.data
          }))
      }
      var member_res = member_pro.sort(function(a, b) {
        return Number(a.__uid) < Number(b.__uid) ? -1 : 1
      })
      if (method == 'verify') {
        /*************
         * 方法：验证本地信息是否完整
         * 功能：如果比较后信息完整，则不回传用户信息
         *************/
        var members_list = event.members
        if ((members_list.length || []) === members_array.length) {
          for (var i = 0; i < members_list.length; i++) {
            if (members_list[i] != members_array[i]) {
              verification = false
              break;
            }
          }
          if (verification) {
            return {
              verification,
              admins_mode,
              ownership,
              admins,
              group_description,
              verified_members,
              privacy
            }
          }
        } else {
          verification = false
        }
      } else {
        verification = false
      }
      for (var i = 0; i < member_res.length; i++) {
        if (typeof(member_res[i]._avatarUrl) === 'undefined' || member_res[i]._avatarUrl == '') {
          member_res[i]._avatarUrl = '/images/Me/default_profile_photo.jpg'
          member_res[i].avatar_text = member_res[i].__realname.substr(-1)
          member_res[i].avatar_color = color_group[Number(member_res[i].__realname.charCodeAt(0) % 16)]
        } else if (member_res[i]._avatarUrl != '/images/Me/default_profile_photo.jpg') {
          member_res[i]._avatarUrl = member_res[i]._avatarUrl.slice(0, -1) + '96'
        } else {
          member_res[i].avatar_text = member_res[i].__realname.substr(-1)
          member_res[i].avatar_color = color_group[Number(member_res[i].__realname.charCodeAt(0) % 16)]
        }
      }
      return {
        verification,
        admins_mode,
        ownership,
        admins,
        members_array,
        member_res,
        group_description,
        verified_members,
        privacy
      }
    }
  }
}