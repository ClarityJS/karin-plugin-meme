import fs from 'node:fs/promises'
import path from 'node:path'

import karin, { ImageElement, segment } from 'node-karin'

import { Config } from '@/common/config'
import { Version } from '@/common/version'

/**
 * 渲染精度
 * @param {string} pct 缩放百分比
 */
function scale (pct = 1) {
  const renderScale = Config.other.renderScale || 100
  const scale = Math.min(2, Math.max(0.5, renderScale / 100))
  pct = pct * scale
  return `style=transform:scale(${pct})`
}

/**
 * 渲染
 * @param name 文件名称 不包含 `.html`
 * @param params 渲染参数
 */
const Render = {
  async render (name: string, params: Record<string, any> = {}) {
    name = name.replace(/.html$/, '')
    const root = `${Version.Plugin_Path}/resources`
    const img = await karin.render({
      type: 'jpeg',
      encoding: 'base64',
      name: `${root}/${name}`.replace(/\\/g, '/'),
      file: `${root}/${name}.html`,
      data: {
        _res_path: `${Version.Plugin_Path}/resources`.replace(/\\/g, '/'),
        defaultLayout: `${Version.Plugin_Path}/resources/common/layout/default.html`.replace(/\\/g, '/'),
        sys: {
          scale: scale(params.scale ?? 1)
        },
        copyright: `${Version.Bot_Name}<span class="version"> ${Version.Bot_Version}</span> & ${Version.Plugin_Name}<span class="version"> ${Version.Plugin_Version}`,
        ...params
      },
      screensEval: '#containter',
      pageGotoParams: {
        waitUntil: 'load',
        timeout: 60000
      }
    })
    return segment.image(`${img.startsWith('base64://') ? img : `base64://${img}`}`)
  }
}
export { Render }
