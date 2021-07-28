<template>
  <div class="home">
    <!-- 列表 -->
    <van-cell-group inset v-for="(item, itemIndex) in list" :key="item.id" class="group">
      <van-cell class="group-title" :title="item.name">
        <van-button icon="plus" type="primary" size="mini" @click="addChildPopup(item, itemIndex)">添加</van-button>
        <van-button icon="delete-o" type="danger" size="mini" @click="delItem(item, itemIndex)">删除</van-button>
      </van-cell>
      <van-swipe-cell v-for="(child, childIndex) in item.children" :key="child.id">
        <van-cell :title="child.name" :value="child.code"/>
        <template #right>
          <van-button square type="danger" text="删除" @click="delChild(item, itemIndex, child, childIndex)"/>
        </template>
      </van-swipe-cell>
    </van-cell-group>

    <!-- 底部菜单 -->
    <div class="footer van-hairline--top">
      <span class="footer-add van-hairline--right">添加板块</span>
      <span class="footer-save">保存目录</span>
    </div>

    <!-- 添加子条目 -->
    <van-popup v-model="addChildShow" position="top" class="add-child">
      <van-cell-group>
        <van-field v-model="childName" label="股票名称" placeholder="请输入股票名称" clearable required/>
        <van-field v-model="childCode" label="股票代码" placeholder="请输入股票代码" clearable required/>
      </van-cell-group>
      <div class="add-child-button">
        <span class="add-child-button-item add-child-button-cancel van-hairline--right" @click="addChildShow = false">取消</span>
        <span class="add-child-button-item add-child-button-confirm" @click="addChild()">确定</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'home',
  data(){
    return {
      list: [],
      addChildShow: false,
      childName: '',
      childCode: '',
      currentItem: {},
      currentItemIndex: 0
    }
  },
  created(){
    this.getFileNotion()
  },
  methods: {
    // 获取证券列表
    async getFileNotion(){
      let res = await this.$api.getFileNotion()
      if(res && res.data){
        let index = 0
        for(let key in res.data){
          this.list.push({
            id: `list${index}`,
            name: key,
            children: this.objectChangeArray(key, res.data)
          })
          index++
        }
      }
    },

    // 将对象转为数组
    objectChangeArray(key, data){
      let tmp = []
      let index = 0
      for(let name in data[key]){
        tmp.push({
          id: `children${index}`,
          name: name,
          code: data[key][name]
        })
        index++
      }
      return tmp
    },

    // 删除板块
    delItem(item, itemIndex){
      this.list.splice(itemIndex, 1)
    },
    
    // 打开添加子条目的弹窗
    addChildPopup(item, itemIndex){
      this.currentItem = item
      this.currentItemIndex = itemIndex
      this.addChildShow = true
    },

    // 添加子条目
    addChild(){
      this.list[this.currentItemIndex].children.push({
        id: this.list[this.currentItemIndex].children.length,
        name: this.childName,
        code: this.childCode
      })
      this.addChildShow = false
    },

    // 删除子条目
    delChild(item, itemIndex, child, childIndex){
      this.list[itemIndex].children.splice(childIndex, 1)
    },

    // saveFile
  }
}
</script>

<style lang="scss" scoped>
.home{
  background-color: #FAFAFA;
  padding-bottom: 110px;
}
.group{
  margin-top: 30px;
  .group-title ::v-deep{
    .van-cell__title{
      font-weight: bold;
      font-size: 30px;
    }
    .van-cell__value{
      margin-top: -5px;
    }
  }
}
.add-child{
  .add-child-button{
    display: flex;
    .add-child-button-item{
      width: 50%;
      line-height: 80px;
      text-align: center;
    }
    .add-child-button-confirm{
      color: #FFF;
      background-color: #07C160;
    }
  }
  
}
.footer{
  position: fixed;
  bottom: 0;
  width: 100%;
  line-height: 80px;
  text-align: center;
  display: flex;
  span{
    width: 50%;
  }
  .footer-add{
    background-color: #FFF;
  }
  .footer-save{
    color: #FFF;
    background-color: #07C160;
  }
}
</style>
