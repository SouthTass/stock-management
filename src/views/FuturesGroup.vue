<template>
  <div class="home">
    <div class="time van-hairline--bottom">
      <span><van-button type="info" size="mini" class="time-btn"
        @click="openNew()">开新仓</van-button></span>
      <span @click="startShow = true">{{startTime | dateFormat('YYYY-MM-DD')}} <van-icon name="play" /></span>
      <span @click="endShow = true">{{endTime | dateFormat('YYYY-MM-DD')}}<van-icon name="play" /></span>
    </div>
    <div class="header-empty"></div>
    <van-cell-group class="group" v-for="item in list" :key="item.id">
      <van-cell :title="item.title">
        <template #default>
          <van-tag type="primary" class="group-btn" @click="addOpenPopup(item)">加 仓</van-tag>
          &nbsp;
          <van-tag type="warning" class="group-btn" @click="subtractOpenPopup(item)">平 仓</van-tag>
        </template>
      </van-cell>
      <van-cell :title="`成本：${item.averagePrice}`" :value="`持仓：${item.totalNumber}`"/>
    </van-cell-group>
    <van-popup v-model="startShow" position="bottom">
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
    <van-popup v-model="open" closeable class="open-style">
      <div class="open-title">开新仓信息</div>
      <van-field v-model="openNewName" label="名称" placeholder="请输入品种名称" />
      <van-field v-model="openNewPrice" label="价格" placeholder="请输入价格" />
      <van-field v-model="openNewNmber" label="数量" placeholder="请输入数量" />
      <van-button class="open-btn" type="info" block @click="createGroup()">确 定</van-button>
    </van-popup>
    <van-popup v-model="addOpen" class="open-style">
      <div class="open-title">加仓信息</div>
      <van-field v-model="addOpenNewPrice" label="价格" placeholder="请输入价格" />
      <van-field v-model="addOpenNewNmber" label="数量" placeholder="请输入数量" />
      <van-button class="open-btn" type="info" block @click="addItem()">确 定</van-button>
    </van-popup>
    <van-popup v-model="subtractOpen" class="open-style">
      <div class="open-title">平仓信息</div>
      <van-field v-model="subtractOpenNewPrice" label="价格" placeholder="请输入价格" />
      <van-field v-model="subtractOpenNewNmber" label="数量" placeholder="请输入数量" />
      <van-button class="open-btn" type="info" block @click="subtractItem()">确 定</van-button>
    </van-popup>
  </div>
</template>

<script>  
export default {
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
      showImg: false,

      currentGroup: {},

      open: false,
      openNewName: '',
      openNewPrice: 0,
      openNewNmber: 0,

      addOpen: false,
      addOpenNewPrice: 0,
      addOpenNewNmber: 0,

      subtractOpen: false,
      subtractOpenNewPrice: 0,
      subtractOpenNewNmber: 0
    }
  },
  mounted(){
    this.getList()
  },
  methods: {
    addOpenPopup(item){
      this.currentGroup = item

      this.addOpen = true
      this.addOpenNewPrice = 0
      this.addOpenNewNmber = 0
    },

    async addItem(){
      this.$toast.loading()
      let res = await this.$api.stockFuturesGroupAdd({
        type: 2,
        parent: this.currentGroup.id,
        name: this.currentGroup.name,
        price: this.addOpenNewPrice,
        number: this.addOpenNewNmber,
        user_name: this.$route.query.user_name
      })
      if(res){
        this.$toast('加仓成功')
        this.addOpen = false
        this.getList()
      }
    },

    subtractOpenPopup(item){
      this.currentGroup = item

      this.subtractOpen = true
      this.subtractOpenNewPrice = 0
      this.subtractOpenNewNmber = 0
    },

    async subtractItem(){
      this.$toast.loading()
      let res = await this.$api.stockFuturesGroupAdd({
        type: 2,
        parent: this.currentGroup.id,
        name: this.currentGroup.name,
        price: this.subtractOpenNewPrice,
        number: -this.subtractOpenNewNmber,
        user_name: this.$route.query.user_name
      })
      if(res){
        this.$toast('平仓成功')
        this.subtractOpen = false
        this.getList()
      }
    },

    openNew(){
      this.openNewName = ''
      this.openNewPrice = 0
      this.openNewNmber = 0
      this.open = true
    },

    async createGroup(){
      let group = await this.$api.stockFuturesGroupAdd({
        type: 1,
        name: this.openNewName,
        user_name: this.$route.query.user_name
      })
      if(!group) return
      let res = await this.$api.stockFuturesGroupAdd({
        type: 2,
        parent: group.data.id,
        name: this.openNewName,
        price: this.openNewPrice,
        number: this.openNewNmber,
        user_name: this.$route.query.user_name
      })
      if(res){
        this.$toast('创建成功')
        this.open = false
        this.getList()
      }
    },

    async getList(){
      let res = await this.$api.stockFuturesGroupFind()
      if(!res) return
      if(res.data.length < 1) this.list = []
      res.data.map(e => {
        e.title = `${this.$dayjs(e.created_at).format('MM-DD HH:mm')}[${e.name}]`
      })
      let groupList = res.data.filter(e => e.type == 1)
      if(groupList.length < 1) return this.list = []

      groupList.map(e => {
        let itemList = res.data.filter(item => item.parent == e.id)
        let totalNumber = 0
        let totalPrice = 0
        if(itemList.length > 0){
          itemList.map(i => {
            totalNumber += Number(i.number)
            totalPrice += (Number(i.number) * Number(i.price))
          })
        }
        e.averagePrice = (totalPrice / totalNumber).toFixed(2)
        e.totalNumber = totalNumber
      })

      this.list = groupList
    }
  },
}
</script>

<style lang="scss" scoped>
.home{
  background-color: #fafafa;
  
}
.home-cell ::v-deep .van-cell__title{
  flex: 3 !important;
  span{
    word-break: break-all;
  }
}
.home-group{
  padding-top: 96px;
}
.header-empty{
  height: 12.8vw;
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
  .time-btn{
    width: 18vw;
    top: -1vw;
    font-size: 3.2vw;
    font-weight: bold;
  }
}
.group{
  margin-bottom: 2vw;
  .group-btn{
    font-weight: bold;
  }
  ::v-deep .van-cell__title{
    flex: 2;
  }
}
.record-image{
  max-width: 40vw;
}
.cell-pre{
  white-space: pre-wrap;
  word-break: break-word;
}
.open-style{
  width: 80vw;
  text-align: center;
  .open-title{
    font-size: 4vw;
    font-weight: bold;
    padding: 4vw;
  }
  .open-btn{
    margin-top: 4vw;
  }
}
</style>