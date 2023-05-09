import Vue from 'vue'
import dayjs from 'dayjs'

Vue.filter('dateFormat', function(val, format){
  return dayjs(val).format(format || 'YYYY-MM-DD HH:mm:ss')
})