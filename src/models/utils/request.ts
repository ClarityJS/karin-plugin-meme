import axiosRetry from 'axios-retry'
import FormData from 'form-data'
import { logger } from 'node-karin'
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'node-karin/axios'

import { Config, Version } from '@/common'
import { BaseType } from '@/types'

type RequestType = BaseType['utils']['requset']

class Request {
  private axiosInstance: AxiosInstance

  constructor () {
    this.axiosInstance = axios.create({
      timeout: Config.server.timeout * 1000
    })

    /**
     * 配置重试机制
     */
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

      if (config.responseType === 'arraybuffer') {
        return {
          success: true,
          data: Buffer.from(response.data as string)
        }
      }

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      this.handleError(error)
      return {
        success: false,
        data: {} as T,
        message: (error as AxiosError).message
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
        ...(isFormData ? data.getHeaders() : {})
      },
      responseType
    })
  }

  private handleError (error: unknown): void {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const errorMessage =
        status === 502
          ? '网络错误'
          : typeof error.response?.data === 'string'
            ? error.response?.data
            : JSON.stringify(error.response?.data) || '未知错误'

      logger.error(`[${Version.Plugin_AliasName}] 请求错误, 状态码: ${status ?? null}, 错误信息: ${errorMessage}`)
    } else {
      logger.error(`[${Version.Plugin_AliasName}] 请求异常: ${error}`)
    }
  }
}

export default new Request()
