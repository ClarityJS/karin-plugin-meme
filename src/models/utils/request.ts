import axiosRetry from 'axios-retry'
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig
} from 'node-karin/axios'

import { Config } from '@/common'
import { Version } from '@/root'
import type { ResponseType } from '@/types'

class Request {
  private axiosInstance: AxiosInstance

  constructor () {
    this.axiosInstance = axios.create({
      timeout: Config.server.timeout * 1000,
      headers: {
        'User-Agent': `${Version.Plugin_Name}/v${Version.Plugin_Version}`
      }
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

  /**
   * 发送请求
   * @param method 请求方法 get post
   * @param url 请求地址
   * @param data 请求数据
   * @param params 请求参数
   * @param headers 请求头
   * @param responseType 响应类型
   * @returns 响应数据
   */
  private async request (
    method: 'get' | 'post' | 'head',
    url: string,
    data?: any,
    params?: Record<string, string> | null,
    headers?: Record<string, string>,
    responseType: 'json' | 'arraybuffer' = 'json'
  ): Promise<ResponseType> {
    const config: AxiosRequestConfig = {
      params,
      headers,
      responseType,
      validateStatus: () => true
    }

    try {
      let response
      switch (method.toLowerCase()) {
        case 'get':
          response = await this.axiosInstance.get(url, config)
          break
        case 'post':
          response = await this.axiosInstance.post(url, data, config)
          break
        case 'head':
          response = await this.axiosInstance.head(url, config)
          break
        default:
          throw new Error('暂不支持该请求方法')
      }

      return {
        success: response.status >= 200 && response.status < 500,
        statusCode: response.status,
        data: response.data,
        msg: response.status >= 200 && response.status < 500 ? '请求成功' : '请求失败'
      }
    } catch (error) {
      const axiosError = error as AxiosError
      return {
        success: false,
        statusCode: axiosError.response?.status ?? 500,
        data: null,
        msg: axiosError.message || '网络连接失败'
      }
    }
  }

  /**
   * 发送 GET 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param headers 请求头
   * @param responseType 响应类型
   * @returns 响应数据
   */
  async get (
    url: string,
    params?: Record<string, string>,
    headers?: Record<string, string>,
    responseType: 'json' | 'arraybuffer' = 'json'
  ): Promise<ResponseType> {
    return this.request('get', url, null, params, headers, responseType)
  }

  /**
   * 发送 HEAD 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param headers 请求头
   * @param responseType 响应类型
   * @returns 响应数据
   */
  async head (
    url: string,
    params?: Record<string, string>,
    headers?: Record<string, string>,
    responseType: 'json' | 'arraybuffer' = 'json'
  ): Promise<ResponseType> {
    return this.request('head', url, null, params, headers, responseType)
  }

  /**
   * 发送 POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param headers 请求头
   * @param responseType 响应类型
   * @returns 响应数据
   */
  async post (
    url: string,
    data: Record<string, unknown>,
    headers?: Record<string, string>,
    responseType: 'json' | 'arraybuffer' = 'json'
  ): Promise<ResponseType> {
    return this.request('post', url, data, null, headers, responseType)
  }
}

export default new Request()
