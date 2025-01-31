import { BaseType } from '@/types/index'
type AdminConfig = BaseType['admin']

export const AdminTypeConfig: Record<string, AdminConfig> = {
  server: {
    title: '服务设置',
    cfg: {
      url: {
        title: '自定义地址',
        desc: '设置自定义表情服务地址',
        type: 'string'
      },
      retry: {
        title: '重试次数',
        desc: '重试次数, 默认为3次',
        type: 'number'
      },
      timeout: {
        title: '超时时间',
        desc: '超时时间，单位为秒',
        type: 'number'
      }
    }
  },
  meme: {
    title: '表情设置',
    cfg: {
      enable: {
        title: '默认表情',
        desc: '是否设置为默认表情',
        type: 'boolean'
      },
      forceSharp: {
        title: '强制前缀',
        desc: '是否强制使用前缀',
        type: 'boolean'
      }
    }
  },
  other: {
    title: '其他设置',
    cfg: {
      renderScale: {
        title: '渲染精度',
        desc: '设置渲染精度',
        type: 'number',
        limit: '50-200'
      }
    }
  }
}
