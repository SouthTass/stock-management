<template>
  <div id="home" class="home" :style="{'top': `${top}px`}">
    <button class="button" @click="animationRender()">开始</button>
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