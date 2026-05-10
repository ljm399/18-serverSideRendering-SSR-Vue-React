import type { AsyncData, UseFetchOptions } from 'nuxt/app'

const BASE_URL = 'http://localhost:3000/api'

type Methods = 'GET' | 'POST'

export interface IResultData<T> {
  code: number
  data: T
}

class HYRequest {
  request<T = any>(
    url: string,
    method: Methods,
    data?: any,
    options?: UseFetchOptions<T>
  ): Promise<AsyncData<T, Error>> {
    return new Promise((resolve) => {
      const newOptions: UseFetchOptions<T> = {
        baseURL: BASE_URL,
        method
      }

      if (method === 'GET') {
        newOptions.query = data
      }

      if (method === 'POST') {
        newOptions.body = data
      }

      Object.assign(newOptions, options)

      resolve(useFetch(url, newOptions))
    })
  }

  get<T = any>(url: string, data?: any, options?: UseFetchOptions<T>) {
    return this.request<T>(url, 'GET', data, options)
  }

  post<T = any>(url: string, data?: any, options?: UseFetchOptions<T>) {
    return this.request<T>(url, 'POST', data, options)
  }
}

export default new HYRequest()
