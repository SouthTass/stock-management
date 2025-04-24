<template>
  <div class="home">
    <div class="time van-hairline--bottom">
      <span>{{name}}<van-icon name="play" /></span>
      <span @click="startShow = true">{{startTime | dateFormat('YYYY-MM-DD')}} <van-icon name="play" /></span>
      <span @click="endShow = true">{{endTime | dateFormat('YYYY-MM-DD')}}<van-icon name="play" /></span>
    </div>
    <div class="home-group">
      <template v-for="item in list">
        <van-cell v-if="item.type == 'text'" class="home-cell" :key="item.id"   
          :title="`${item.from_name}：${item.content}`" :value="item.time"
          :style="{'color': item.color}">
          <template #title>
            <div>FROM：{{item.from_name}}</div>
            <pre class="cell-pre">{{item.content}}</pre>
          </template>
        </van-cell>
        <van-cell v-if="item.type == 'image' && showImg" 
          class="home-cell" :key="item.id" :title="item.from_name">
          <template #label>
            <img referrerpolicy="no-referrer" class="record-image" :key="item.id" :src="item.content">
          </template>
        </van-cell>
      </template>
    </div>
    <van-empty v-if="list.length < 1" description="暂无记录" />
    <van-popup
     v-model="startShow" position="bottom">
      <van-datetime-picker
        v-model="startTime"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="startShow = false"
        @confirm="startShow = false; startTime = $event; getWxChatRecord()"/>
    </van-popup>
    <van-popup v-model="endShow" position="bottom">
      <van-datetime-picker
        v-model="endTime"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="endShow = false"
        @confirm="endShow = false; endTime = $event; getWxChatRecord()"/>
    </van-popup>
    <van-popup v-model="userShow" position="bottom">
      <van-picker title="名称" show-toolbar :columns="userList"
        @cancel="userShow = false"
        @confirm="userShow = false; name = $event; getWxChatRecord()"/>
    </van-popup>
  </div>
</template>

<script>  
export default {
  name: 'home',
  data(){
    return {
      list: [],
      title: '',
      name: '',
      startTime: new Date(),
      endTime: new Date(),
      userList: [],
      userShow: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      startShow: false,
      endShow: false,
      showImg: false
    }
  },
  created(){
    if(this.$route.query.showImg) this.showImg = true
    this.getWxChatUser()
    this.getWxChatRecord()
    setInterval(() => {
      this.getWxChatRecord()
    }, 5000)
  },
  methods: {
    async getWxChatRecord(){
      let params = {
        start_time: `${this.$dayjs(this.startTime).format('YYYY-MM-DD')} 00:00:00`, 
        end_time: `${this.$dayjs(this.endTime).format('YYYY-MM-DD')} 23:59:59`
      }
      if(this.name) params.name = this.name
      if(this.$route.query.room){
        params.room = this.$route.query.room
        document.title = params.room
      }
      params = {}
      let res = await this.$api.getWxChatRecord(params)
      if(res.status != 200) return this.$toast(res.message)
      if(res.data && res.data.length > 0) {
        if(this.list.length > 0 && this.list[0].id == res.data[0].id) return
        let checkUserList = [
          { name: '山顶动人', id: 'out-man1992'},
          { name: '远大师', id: 'wxid_y9sdsrm8yw9a22'},
          { name: 'mary姐', id: 'wxid_91mpeutpvaeh12'},
          { name: '一梦', id: 'zhangming6877'},
          { name: '期货', id: '25984983213818793@openim'},
          { name: '期货2', id: '25984984621874461@openim'},
          { name: '期货3', id: 'u_5ed4bd27d6ad2_EZkaEkdhbn'}
        ]
        res.data.map(e => {
          e.color = '#000000'
          e.time = this.$dayjs(e.created_at).format('HH:mm:ss')
          let tIndex = checkUserList.findIndex(item => item.id == e.wxid)
          if(tIndex != -1) e.color = '#ff0000'
        })
        this.list = res.data || []
        this.title = `【${this.list[0].from_name}】 ${this.$dayjs().format('YYYY年MM月DD日')}发言记录`
      }
    }, 

    async getWxChatUser(){
      let res = await this.$api.getWxChatUser({room: '反孟机动小分队'})
      res.data.map(e => this.userList.push(e.from_name))
    }
  },
}
</script>

<style lang="scss" scoped>
.home-cell ::v-deep .van-cell__title{
  flex: 3 !important;
  span{
    word-break: break-all;
  }
}
.home-group{
  padding-top: 96px;
}
.time{
  width: 100vw;
  height: 96px;
  line-height: 96px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: #fafafa;
  display: flex;
  justify-content: space-around;
  ::v-deep .van-icon{
    transform: rotate(90deg);
    padding-left: 8px;
    padding-top: 5px;
  }
}
.record-image{
  max-width: 40vw;
}
.cell-pre{
  white-space: pre-wrap;
  word-break: break-word;
}
</style>