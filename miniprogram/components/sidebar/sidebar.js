Component({
  data: {
    sidebar_items: [{ title: "#", top: 0, top_temp:0  }, { title: "A", top: 20, top_temp:0  }, { title: "B", top: 40, top_temp:0  }, { title: "C", top: 60, top_temp:0  }, { title: "D", top: 80, top_temp:0  }, { title: "E", top: 100, top_temp:0  }, { title: "F", top: 120, top_temp:0  }, { title: "G", top: 140, top_temp:0  }, { title: "H", top: 160, top_temp:0  }, { title: "I", top: 180, top_temp:0  }, { title: "J", top: 200, top_temp:0  }, { title: "K", top: 220, top_temp:0  }, { title: "L", top: 240, top_temp:0  }, { title: "M", top: 260, top_temp:0  }, { title: "N", top: 280, top_temp:0  }, { title: "O", top: 300, top_temp:0  }, { title: "P", top: 320, top_temp:0  }, { title: "Q", top: 340, top_temp:0  }, { title: "R", top: 360, top_temp:0  }, { title: "S", top: 380, top_temp:0  }, { title: "T", top: 400, top_temp:0  }, { title: "U", top: 420, top_temp:0  }, { title: "V", top: 440, top_temp:0  }, { title: "W", top: 460, top_temp:0  }, { title: "X", top: 480, top_temp:0  }, { title: "Y", top: 500, top_temp:0  }, { title: "Z", top: 520 }],
    sidebar_height: 540,
    sidebar_top: 0,
    sidebar_index: -10,
    sidebar_index_sel: -10,
    sidebar_restore: -1,
    sidebar_origin: -1,
    tips_ani: true,
    last_position: 0,
    sidebar_tips_timer: undefined,
    sidebar_idx_timer: undefined,
  },
  methods: {
    sidebar_setinfo: function (value) {
      this.setData({
        sidebar_top: value.top
      })
      if (value.height < 540) {
        var h = value.height / 27
        for (var i = 0; i < this.data.sidebar_items.length; i++) {
          this.data.sidebar_items[i].top = i * h
        }
        this.setData({
          item_height: h,
          sidebar_height: value.height,
          sidebar_items: this.data.sidebar_items,
          sidebar_restore: 'Z'
        })
        this.setData({
          sidebar_restore: -1
        })
      }
    },
    sidebar_getinfo: function(){
      return this.data.sidebar_index
    },
    sidebar_setindex: function(idx){
      if (this.data.sidebar_index != -10){
        this.setData({
          tips_ani: false
        })
        clearTimeout(this.data.sidebar_idx_timer)
        this.data.sidebar_idx_timer = undefined
      }
      console.log("idx=",idx)
      this.setData({
        sidebar_index: idx
      })
      var timer = setTimeout(()=>{
        this.setData({
          tips_ani: true
        })
        this.setData({
          sidebar_index: -10
        })
        this.data.sidebar_idx_timer = undefined
      }, 900)
      this.data.sidebar_idx_timer = timer
    },
    sidebar_setselcted: function (i) {
      this.setData({
        sidebar_index_sel: i
      })
    },
    sidebar_start: function(e) {
      if (this.data.sidebar_tips_timer!=undefined){
        clearTimeout(this.data.sidebar_tips_timer)
        this.data.sidebar_tips_timer = undefined
      }
      var characters = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      var id = e.currentTarget.id.replace(/sidebar-mov-item-/, "")
      id = ((id == 0) ? '#' : id)
      var flag = characters.indexOf(id)
      var tips_pos = this.data.sidebar_top - 22 + this.data.sidebar_height / 54 * (2 * flag + 1)
      this.data.sidebar_start_index = flag
      this.setData({
        sidebar_origin: id,
        sidebar_index: flag,
        sidebar_index_sel: flag,
        tips_pos: tips_pos,
        initial: id
      })
    },
    sidebar_move: function(e) {
      var current_position = e.currentTarget.offsetTop + e.detail.y
      var delta = current_position - this.data.last_position
      this.data.last_position = current_position
      this.sidebar_calc(current_position, 'm', delta)
      this.setData({
        tips_ani: false
      })
    },
    sidebar_end: function(e) {
      var current_position = e.changedTouches[0].clientY - this.data.sidebar_top
      this.sidebar_calc(current_position, 'e', 0)
      this.setData({
        tips_ani: true
      })
    },
    sidebar_calc: function(current_position, method, delta) {
      var characters = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      var item_height = this.data.sidebar_height / 27
      var new_index = 0
      if (delta != 0) {
        current_position = (current_position < 0) ? 0 : current_position
        current_position = (current_position > this.data.sidebar_height) ? this.data.sidebar_height : current_position
        new_index = Math.round(current_position / item_height)
        new_index = (new_index < 0) ? 0 : new_index
        new_index = (new_index > 26) ? 26 : new_index
      }
      else {
        new_index = this.data.sidebar_index
      }
      if (new_index != this.data.sidebar_index) {
        this.setData({
          tips_pos: this.data.sidebar_top - 22 + this.data.sidebar_height / 54 * (2 * new_index + 1),
          sidebar_index: new_index,
          sidebar_index_sel: new_index,
          initial: characters.charAt(new_index)
        })
      }
      if(method == 'e'){
        this.sidebar_ani_timer(new_index)
        this.setData({
          sidebar_restore: this.data.sidebar_origin
        })
        this.data.sidebar_items[characters.indexOf(this.data.sidebar_origin)].top_temp = 0
        this.setData({
          sidebar_origin: -1,
          sidebar_restore: -1,
          sidebar_items: this.data.sidebar_items
        })
      }
    },
    sidebar_ani_timer(flag) {
      var that = this
      var characters = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      var timer = setTimeout(function () {
        that.setData({
          sidebar_index: -10,
        })
        that.data.sidebar_tips_timer != undefined
      }, 900)
      this.data.sidebar_tips_timer = timer
    },
  }
})
