import axios from 'axios'
import { userStore } from '@/store'
import { ElMessage } from 'element-plus'

const xhr = axios.create({
    baseURL: 'http://127.0.0.1:3000',
})

// 请求拦截
xhr.interceptors.request.use((config) => {
    let userToken = userStore();
    config.headers.Authorization = userToken.token;
    return config
}, (err) => {
    return Promise.reject(err)
})

// 响应拦截
xhr.interceptors.response.use((response) => {

    !response.data.status ? ElMessage({
        type: 'success',
        message: response.data.message
    }) : response.data.status == 1 ?
        ElMessage({
            type: 'error',
            message: response.data.message
        }) : ''
    return response.data
}, (err) => {
    return Promise.reject(err)
})

export default xhr;