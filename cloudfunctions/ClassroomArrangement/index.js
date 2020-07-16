// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'bupt-classroom-booking'//cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

const page_limit = 100     //云函数取100，小程序端取20
const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const sections = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14']
const section_time = ['08:00', '08:50', '09:50', '10:40', '11:30', '13:00', '13:50', '14:45', '15:40', '16:35', '17:25', '18:30', '19:20', '20:10']

exports.main = async (event, context) => {
  var classroom_list = []
  var result = await db.collection('ClassroomInfo').where({
    campus: event.campus,
    capacity: _.and(_.gte(event.volume_min), _.lte(event.volume_max)),
    type: event.type
  }).get().then(res => {
    return res.data
  })
  for (var i = 0; i < result.length; i++) {
    classroom_list.push(result[i].classroom)
  }
  var start = 0           //已经查找过的记录数量
  var query_result = []   //储存查询结果的数组
  var count = 0           //当前页面返回值数量
  var _where
  if (event.week_start == event.week_end) {
    _where = {
      classroom: _.in(classroom_list),
      week_search: db.RegExp({
        regexp: event.week_start < 10 ? '0' + event.week_start : event.week_start.toString()
      }),
      date_search: _.and(_.lte(event.date_end), _.gte(event.date_start)),
      section_search: _.and(_.lte(event.section_end), _.gte(event.section_start))
    }
  }
  else if (event.week_start == event.week_end - 1) {
    _where = _.or({
      classroom: _.in(classroom_list),
      week_search: db.RegExp({
        regexp: event.week_start < 10 ? '0' + event.week_start : event.week_start.toString()
      }),
      date_search: _.and(_.lte(event.date_end), _.gte(event.date_start)),
      section_search: _.and(_.lte(event.section_end), _.gte(event.section_start))
    }, {
      classroom: _.in(classroom_list),
      week_search: db.RegExp({
        regexp: event.week_end < 10 ? '0' + event.week_end : event.week_end.toString()
      }),
      date_search: _.and(_.lte(event.date_end), _.gte(event.date_start)),
      section_search: _.and(_.lte(event.section_end), _.gte(event.section_start))
    })
  }
  do {
    var result_temp = await db.collection('Curriculum')
      .where(_where).skip(start).get().then(res => { return res.data })
    count = result_temp.length  //更新当前页面记录数量
    start = start + page_limit  //更新已经查询的记录数量
    query_result = query_result.concat(result_temp) //查询结果数组拼合
  } while (count >= page_limit)   //查询终止条件
  var classroom_un = []
  for (var i = 0; i < query_result.length; i++) {
    classroom_un.push(query_result[i].classroom)
  }
  var classroom_set = new Set(classroom_un)
  var classroom_ava = []
  for (var i = 0; i < classroom_list.length; i++) {
    if (!classroom_set.has(classroom_list[i])) {
      classroom_ava.push(classroom_list[i])
    }
  }
  classroom_list = classroom_ava
  do {
    var result_temp = await db.collection('Activities')
      .where(_where).skip(start).get().then(res => { return res.data })
    count = result_temp.length  //更新当前页面记录数量
    start = start + page_limit  //更新已经查询的记录数量
    query_result = query_result.concat(result_temp) //查询结果数组拼合
  } while (count >= page_limit)   //查询终止条件
  classroom_un = []
  for (var i = 0; i < query_result.length; i++) {
    classroom_un.push(query_result[i].classroom)
  }
  classroom_set = new Set(classroom_un)
  var classroom_choice = '等待分配'
  for (var i = 0; i < classroom_list.length; i++) {
    if (!classroom_set.has(classroom_list[i])) {
      classroom_choice = classroom_list[i]
      break
    }
  }
  db.collection('ActivityApplication').doc(event._id).update({
    data: {
      classroom: classroom_choice
    }
  })
  if (event.week_start == event.week_end) {
    for (var i = event.date_start; i <= event.date_end; i++) {
      for (var j = event.section_start; j <= event.section_end; j++) {
        let date = i;
        let section = j;
        db.collection('Activities').add({
          data: {
            classroom: classroom_choice,
            course: '已被借用',
            date_display: days[date - 1],
            date_search: date,
            section_display: '第' + sections[section - 1] + '节',
            section_search: section,
            week_display: event.week_start < 10 ? '0' + event.week_start : event.week_start.toString() + '周',
            week_search: event.week_start < 10 ? '0' + event.week_start : event.week_start.toString() + '周'
          }
        })
      }
    }
  }
  else if (event.week_start == event.week_end - 1) {
    for (var i = event.date_start; i <= 7; i++) {
      for (var j = event.section_start; j <= event.section_end; j++) {
        let date = i;
        let section = j;
        db.collection('Activities').add({
          data: {
            classroom: classroom_choice,
            course: '已被借用',
            date_display: days[date - 1],
            date_search: date,
            section_display: '第' + sections[section - 1] + '节',
            section_search: section,
            week_display: event.week_start < 10 ? '0' + event.week_start : event.week_start.toString() + '周',
            week_search: event.week_start < 10 ? '0' + event.week_start : event.week_start.toString() + '周'
          }
        })
      }
    }
    for (var i = 1; i <= event.date_end; i++) {
      for (var j = event.section_start; j <= event.section_end; j++) {
        let date = i;
        let section = j;
        db.collection('Activities').add({
          data: {
            classroom: classroom_choice,
            course: '已被借用',
            date_display: days[date - 1],
            date_search: date,
            section_display: '第' + sections[section - 1] + '节',
            section_search: section,
            week_display: event.week_end < 10 ? '0' + event.week_end : event.week_end.toString() + '周',
            week_search: event.week_end < 10 ? '0' + event.week_end : event.week_end.toString() + '周'
          }
        })
      }
    }
  }
  cloud.callFunction({
    name: 'MessagePushService',
    data: {
      method: 'changed',
      group_id: event.group_id,
      creator: event.creator,
      template_id: 'f6bfX5Ve-DEmv-8xrEzoXedd-v_ea45Pjwa6Xv00_Uk',
      page_path: 'index',
      push_data: {
        phrase1: { value: '审核通过' },
        time3: {
          value: '2020年' + event.timeS.substring(0, event.timeS.indexOf(' ')) + ' ' +
            section_time[sections.indexOf(event.timeS.substring(event.timeS.indexOf('第') + 1, event.timeS.indexOf('节')))]
        },
        name4: { value: event.person.substring(0, 10) },
        thing2: { value: event.name.substring(0, 20) }
      }
    }
  })
  cloud.callFunction({
    name: 'MessagePushService',
    data: {
      method: 'release',
      group_id: event.group_id,
      template_id: 'fgAy80rTjWmiBZSGXUhP-kivXym3ZPC2SBZoUs9wuUY',
      page_path: 'index',
      push_data: {
        character_string10: {
          value:
            event.timeS.substring(0, event.timeS.indexOf('月')) + '-' +
            event.timeS.substring(event.timeS.indexOf('月') + 1, event.timeS.indexOf('日')) + '/' +
            event.timeS.substring(event.timeS.indexOf('第') + 1, event.timeS.indexOf('节')) +
            '～' + event.timeE.substring(0, event.timeE.indexOf('月')) + '-' +
            event.timeE.substring(event.timeE.indexOf('月') + 1, event.timeE.indexOf('日')) + '/' +
            event.timeE.substring(event.timeE.indexOf('第') + 1, event.timeE.indexOf('节'))
        },
        thing6: { value: event.name.substring(0, 20) },
        thing4: { value: (event.campus + ' ' + classroom_choice).substring(0, 20) },
        thing11: { value: event.remarks == '' ? '无' : event.remarks.substring(0, 20) }
      }
    }
  })
  return { classroom_choice }
}