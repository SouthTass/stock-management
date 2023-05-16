<template>
  <div id="home">
    <img src="http://wxapp.tc.qq.com/262/20304/stodownload?m=c780c5a4354ca4e73bfd01e9055a1eae&filekey=30350201010421301f02020106040253480410c780c5a4354ca4e73bfd01e9055a1eae0203016de7040d00000004627466730000000132&hy=SH&storeid=2631ed840000e02cc000000000000010600004f5053481ccc596097595ad85&bizid=1023">
  </div>
  
</template>

<script>
export default {
  name: 'animation',
  data(){
    return {
      top: 0,
      lastTime: 0,
      elapsedTime: null
    }
  },
  mounted() {
    // this.animationRender();
  },
  methods: {
    animationRender(){
      let now = (+new Date())
      if(this.lastTime !== 0) this.elapsedTime = (now - this.lastTime)
      this.top += this.elapsedTime / 50
      window.requestAnimationFrame(this.animationRender);
      this.lastTime = now
    }
  }
}
</script>

<style lang="scss" scoped>
.home{
  width: 100%;
  height: 2px;
  background-color: red;
  position: relative;
}
.button{
  position: fixed;
  top: 0;
}
</style>