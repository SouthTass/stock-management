import axios from "axios"
const _axios = axios.create({ timeout: 30000 });
import { Toast } from 'vant'

class Api {
  constructor() {
    _axios.interceptors.request.use(req => {
      Toast.loading({ message: '努力奔跑中···', forbidClick: true, duration: 0 });
      return req;
    }, err => {
      Toast.clear();
      return err;
    });
    _axios.interceptors.response.use(res => {
      Toast.clear();
      return res.data;
    }, err => {
      Toast.clear();
      Toast(err.response.data.message); 
      return false;
    });
  }

  /** 
   * 获取证券列表文件
   */
  async getFileNotion(){
    return _axios.get(`/api/file/notion`);
  }
}
export default new Api();