import axios from 'axios'

const MyHttpServer = {}
MyHttpServer.install = function(Vue) {
  axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
  Vue.prototype.$http = axios
  //添加请求拦截器
  axios.interceptors.request.use(
    config => {
      console.log(config)
      config.headers.Authorization = sessionStorage.getItem('token')
      return config
    },
    function(error) {
      //对请求错误做些什么
      return Promise.reject(error)
    }
  )
  //添加响应拦截器
  axios.interceptors.response.use(
    function(response) {
      //对响应数据做点什么
      return response
    },
    function(error) {
      return Promise.reject(error)
    }
  )
}

export default MyHttpServer
