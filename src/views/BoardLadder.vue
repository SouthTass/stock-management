<template>
  <div class="home">
    <div id="line-charts"></div>
  </div>
</template>

<script setup>  
import Api from '@/api/api'
import dayjs from 'dayjs'
import * as echarts from 'echarts'

const getList = async function(){
  let res = await Api.getStockBoardLadderList({
    page_size: 1000
  })
  if(res.status != 200) return

  let myChart = echarts.init(document.getElementById('line-charts'))

  let option = {
    title: {
      text: '近30日连板天梯',
      left: 'center'
    },
    tooltip: {},
    xAxis: {
      data: []
    },
    yAxis: {},
    series: [
      {
        name: '连板数',
        type: 'line',
        smooth: true,
        data: []
      }
    ]
  }
  res.data.forEach(e => {
    let index = option.xAxis.data.findIndex(item => item == e.time)
    if(index < 0) option.xAxis.data.unshift(e.time)
  })
  option.xAxis.data.forEach(e => {
    let arr = res.data.filter(item => item.time == e)
    option.series[0].data.push(arr.length)
  })
  myChart.setOption(option)
}

getList()
</script>

<style lang="scss" scoped>
.home{
  width: 100vw;
  height: 100vh;
}
#line-charts{
  width: 100vh;
  height: 100vw;
  transform: rotate(90deg);
  transform-origin: 50vw 50vw;
  position: fixed;
  top: 0;
  left: 0;
}
</style>