import Axios, { AxiosResponse } from 'axios'
import qs from 'qs'
import CustomRequestInterceptor from '@/api/interceptors/CustomRequestInterceptor'
export const baseURL = 'http://localhost:3005/'

export const CONTENT_TYPE = 'Content-Type'

export const FORM_URLENCODED = 'application/x-www-form-urlencoded; charset=UTF-8'

export const APPLICATION_JSON = 'application/json; charset=UTF-8'

export const TEXT_PLAIN = 'text/plain; charset=UTF-8'

const service = Axios.create({
  baseURL,
  timeout: 10 * 60 * 1000,
})

service.interceptors.request.use(
  (config) => {
    !config.headers && (config.headers = {})
    if (!config.headers[CONTENT_TYPE]) {
      config.headers[CONTENT_TYPE] = APPLICATION_JSON
    }
    if (config.headers[CONTENT_TYPE] === FORM_URLENCODED) {
      config.data = qs.stringify(config.data)
    }
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  }
)
service.interceptors.request.use((config) => {
  return CustomRequestInterceptor(config)
})
service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200 || response.status === 201) {
      return response
    } else {
      throw new Error(response.status.toString())
    }
  },
  (error) => {
    if (import.meta.env.MODE === 'development') {
      console.log(error)
    }
    return Promise.reject({ code: error.response.data.code, msg: error.response.data?.message })
  }
)

export default service
