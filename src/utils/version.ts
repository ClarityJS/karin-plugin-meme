import fs from 'node:fs'

import { config, requireFileSync } from 'node-karin'
import _ from 'node-karin/lodash'
import path from 'path'
import { fileURLToPath } from 'url'

import type { UtilsType } from '@/types'

const filePath = fileURLToPath(import.meta.url).replace(/\\/g, '/')
const dirPath = path.resolve(filePath, '../../../')
const basename = path.basename(dirPath)

const pkg = requireFileSync(path.resolve(`${dirPath}/package.json`))

let changelogs = []
let currentVersion
const versionCount = 3
const CHANGELOG_path = `${dirPath}/CHANGELOG.md`
function getLine (line:UtilsType['change']['getLine']['line']) {
  return line
    .replace(/^\s*[\*\-]\s*/, '')
    .replace(/\s*`([^`]+)`/g, '<span class="cmd">$1</span>')
    .replace(/\*\*([^*]+)\*\*/g, '<span class="strong">$1</span>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="link">$1</span>')
}

try {
  if (fs.existsSync(CHANGELOG_path)) {
    const logs = fs.readFileSync(CHANGELOG_path, 'utf8') || ''
    const lines = logs.replace(/\t/g, '   ').split('\n')
    let temp: UtilsType['change']['getTemp'] = { logs: [] }
    let lastCategory: UtilsType['change']['getChange'] = { title: '', logs: [] }

    _.forEach(lines, (line) => {
      if (changelogs.length >= versionCount) return false

      const versionMatch = /^##?\s*\[?([0-9a-zA-Z\\.~\s]+)]?(?:$([^)]+)$)?/.exec(line.trim())
      if (versionMatch && versionMatch[1]) {
        if (temp.version) {
          changelogs.push(temp)
        }
        temp = {
          version: versionMatch[1].trim(),
          logs: []
        }

        lastCategory = { title: '', logs: [] }
        return
      }

      const categoryMatch = /^###\s+(.*)/.exec(line.trim())
      if (categoryMatch && categoryMatch[1]) {
        lastCategory = { title: getLine(categoryMatch[1]), logs: [] }
        temp.logs.push(lastCategory)
        return
      }

      const logMatch = /^\s*[\*\-]\s+(.*)/.exec(line)
      if (logMatch && logMatch[1]) {
        const logItem = getLine(logMatch[1])
        if (lastCategory.logs) {
          lastCategory.logs.push(logItem)
        } else {
          temp.logs.push({ title: '', logs: [logItem] })
        }
      }
    })

    if (temp.version && changelogs.length < versionCount) {
      changelogs.push(temp)
    }

    if (changelogs.length > 0) {
      currentVersion = changelogs[0].version
      changelogs[0].version += ' <span class="new"></span>'
    }
  }
} catch (err) {
}

let Bot_Name:UtilsType['version']['Bot_Name']
switch (config.pkg().name) {
  case 'node-karin':
    Bot_Name = 'Karin'
    break
}
const Version:UtilsType['version'] = {
  /** 当前Bot名称 */
  get Bot_Name () {
    return Bot_Name
  },
  /** 当前Bot版本 */
  get Bot_Version () {
    return config.pkg().version
  },
  /** 插件包路径 */
  get Plugin_Path () {
    return dirPath
  },
  /** 插件包名称 */
  get Plugin_Name () {
    return basename
  },
  /** 插件包别名 */
  get Plugin_AliasName () {
    return '清语表情'
  },
  /** 插件包版本 */
  get Plugin_Version () {
    return pkg.version
  },
  get Plugin_Logs () {
    return changelogs
  }

}
export { Version }
