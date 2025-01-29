import path from 'node:path'

import karin, { segment } from 'node-karin'

import type { UtilsType } from '@/types'

import { Config } from './config'
import { Version } from './version'

type RenderType = UtilsType['render']

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
  async render (name: RenderType['name'], params: RenderType['parms'] = {}) {
    name = name.replace(/.html$/, '')
    const root = `${Version.Plugin_Path}/resources`
    const img = await karin.render({
      name: path.basename(name),
      type: 'jpeg',
      file: `${root}/${name}.html`,
      data: {
        _res_path: `${Version.Plugin_Path}/resources`.replace(/\\/g, '/'),
        defaultLayout: `${Version.Plugin_Path}/resources/common/layout/default.html`.replace(/\\/g, '/'),
        sys: {
          scale: scale(params.scale || 1)
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
    return segment.image(`base64://${img}`)
  }
}
export { Render }
