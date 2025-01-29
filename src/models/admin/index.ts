import { ModelsType } from '@/types/index'
type AdminConfig = ModelsType['admin']

export const AdminTypeConfig: Record<string, AdminConfig> = {
  meme: {
    title: '表情设置',
    cfg: {
      enabled: {
        title: '默认表情',
        desc: '是否设置为默认表情',
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
