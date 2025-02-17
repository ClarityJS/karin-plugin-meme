import axiosRetry from 'axios-retry'
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'node-karin/axios'

import { Config } from '@/common'
import { BaseType } from '@/types'

type RequestType = BaseType['utils']['requset']

class Request {
  private axiosInstance: AxiosInstance

  constructor () {
    this.axiosInstance = axios.create({
      timeout: Config.server.timeout * 1000
    })

    // 配置重试机制
    axiosRetry(this.axiosInstance, {
      retries: Config.server.retry,
      retryDelay: () => 0,
      shouldResetTimeout: true,
      retryCondition: (error: AxiosError) => {
        if (error.response) {
          return error.response.status === 500
        }
        return axiosRetry.isNetworkOrIdempotentRequestError(error)
      }
    })
  }

  private async request<T> (config: RequestType['config']): Promise<RequestType['response']> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.request(config)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      const errorMessage = this.handleError(error)
      return {
        success: false,
        data: {} as T,
        message: errorMessage
      }
    }
  }

  // GET 请求
  async get<T> (
    url: string,
    params?: Record<string, unknown>,
    headers?: Record<string, string>,
    responseType: 'json' | 'arraybuffer' = 'json'
  ): Promise<RequestType['response']> {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      headers,
      responseType
    })
  }

  // HEAD 请求
  async head<T> (
    url: string,
    params?: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<RequestType['response']> {
    return this.request<T>({
      url,
      method: 'HEAD',
      params,
      headers
    })
  }

  // POST 请求
  async post<T> (
    url: string,
    data: Record<string, unknown> | FormData,
    headers?: Record<string, string>,
    responseType: 'json' | 'arraybuffer' = 'json'
  ): Promise<RequestType['response']> {
    const isFormData = data instanceof FormData

    return this.request<T>({
      url,
      method: 'POST',
      data,
      headers: {
        ...headers,
        ...(isFormData ? {} : {})
      },
      responseType
    })
  }

  /**
   * 处理错误信息，不直接输出日志，而是返回错误信息
   */
  private handleError (error: unknown): string {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      let errorMessage: string

      if (status === 502) {
        errorMessage = '网络错误'
      } else if (error.response?.data) {
        if (Buffer.isBuffer(error.response.data)) {
          errorMessage = error.response.data.toString('utf-8')
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data
        } else {
          errorMessage = JSON.stringify(error.response.data)
        }
      } else {
        errorMessage = '未知错误'
      }

      return errorMessage
    } else {
      return error as string
    }
  }
}

export default new Request()
