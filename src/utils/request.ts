import axios, { type AxiosRequestConfig } from "axios"

class Request {
    baseURL: string
    timeout: number
    constructor() {
        this.baseURL = import.meta.env.MODE === 'development' ? 'http://192.168.2.233:7084/api/' : '/api/'
        this.timeout = 10000
    }
    request(config: AxiosRequestConfig<any>) {
        const instance = axios.create({
            baseURL: this.baseURL,
            timeout: this.timeout,
        })
        // 设置拦截器
        instance.interceptors.request.use((config) => {
            config.headers!.Authorization = localStorage.getItem('token')
            return config
        }, err => Promise.reject(err))
        // 设置响应拦截器
        //instance.interceptors.response.use(res => res.data, err => Promise.reject(err));

        return instance(config)
    }
}
export default new Request()
