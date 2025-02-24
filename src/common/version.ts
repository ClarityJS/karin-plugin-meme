import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config, existsSync, logs, requireFileSync } from 'node-karin'

import { BaseType } from '@/types'
type VersionType = BaseType['common']['version']

const filePath = fileURLToPath(import.meta.url).replace(/\\/g, '/')
const dirPath = path.resolve(filePath, '../../../').replace(/\\/g, '/')
const basename = path.basename(dirPath)

const pkg = requireFileSync(`${dirPath}/package.json`)

let changelogs = []
const versionCount = 3
const CHANGELOG_path = `${dirPath}/CHANGELOG.md`

try {
  function getLine (line: string) {
    const patterns = [
      { regex: new RegExp('\\s*`([^`]+)`', 'g'), replacement: '<span class="cmd">$1</span>' },
      { regex: new RegExp('\\*\\*\\s*([^*]+)\\s*\\*\\*', 'g'), replacement: '<span class="strong">$1</span>' },
      { regex: new RegExp('\\(\\[([^\\]]+)\\]\\(([^)]+)\\)\\)', 'g'), replacement: '<span class="link">$1</span>' }
    ]

    patterns.forEach(({ regex, replacement }) => {
      line = line.replace(regex, replacement)
    })

    return line
  }

  if (existsSync(CHANGELOG_path)) {
    const changelogData = requireFileSync(CHANGELOG_path)
    const extractedLogs = logs(pkg.version, changelogData, versionCount)

    const lines = extractedLogs.replace(/\t/g, '   ').split('\n')
    let temp: { version?: string, logs: { title: string, logs: string[] }[] } = { logs: [] }
    let lastCategory: { title: string, logs: string[] } = { title: '', logs: [] }

    lines.forEach((line) => {
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
      pkg.version = changelogs[0].version
      changelogs[0].version += ' <span class="new"></span>'
    }
  }
} catch (err) {
}

const Version:VersionType = {
  /** 当前Bot名称 */
  get Bot_Name () {
    return config.pkg().name === 'node-karin' ? 'Karin' : config.pkg().name
  },
  /** 当前Bot版本 */
  get Bot_Version () {
    return config.pkg().version
  },
  /** 当前Bot路径 */
  get Bot_Path () {
    return process.cwd().replace(/\\/g, '/')
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
  get Plugin_Anthor () {
    return pkg.author
  },
  /** 插件包更新日志 */
  get Plugin_Logs () {
    return changelogs
  }
}

export { Version }
