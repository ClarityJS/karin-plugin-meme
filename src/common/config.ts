import path from 'node:path'

import { copyConfigSync, filesByExt, getFiles, karinPathBase, requireFileSync, watch, YamlEditor } from 'node-karin'

import { Version } from '@/root'
import type { ConfigType } from '@/types'

type ConfigDirType = 'config' | 'defSet'

class Cfg {
  /** 用户配置文件路径 */
  private dirCfgPath: string
  /** 默认配置文件路径 */
  private defCfgPath: string

  constructor () {
    this.dirCfgPath = `${karinPathBase}/${Version.Plugin_Name}/config/`
    this.defCfgPath = `${Version.Plugin_Path}/config/defSet/`
  }

  /** 初始化配置 */
  initCfg () {
    copyConfigSync(this.defCfgPath, this.dirCfgPath)

    const files = filesByExt(this.dirCfgPath, '.yaml', 'name')
    for (const file of files) {
      const configEditor = new YamlEditor(`${this.dirCfgPath}/${file}`)
      const defConfigEditor = new YamlEditor(`${this.defCfgPath}/${file}`)

      const { differences, result } = this.mergeObjectsWithPriority(configEditor, defConfigEditor)
      if (differences) {
        result.save()
      }
    }

    /**
     * @description 监听配置文件
     */
    const list = filesByExt(this.dirCfgPath, '.yaml', 'abs')
    list.forEach((file) =>
      watch(file, (old, now) => {
        // logger.info('旧数据:', old);
        // logger.info('新数据:', now);
      })
    )

    return this
  }

  /**
   * 获取默认配置和用户配置
   * @param name 配置文件名
   * @returns 返回合并后的配置
   */
  getDefOrConfig (name: keyof ConfigType) {
    const def = this.getYaml('defSet', name)
    const config = this.getYaml('config', name)
    return { ...def, ...config }
  }

  /** 获取所有配置文件 */
  All (): ConfigType {
    const allConfig: ConfigType = {} as ConfigType

    const files = getFiles(this.defCfgPath, ['.yaml'])

    files.forEach((file) => {
      const fileName = path.basename(file, '.yaml') as keyof ConfigType
      allConfig[fileName] = this.getDefOrConfig(fileName) ?? ({} as ConfigType[keyof ConfigType])
    })

    return allConfig
  }

  /**
   * 获取 YAML 文件内容
   * @param type 配置文件类型
   * @param name 配置文件名
   * @returns 返回 YAML 文件内容
   */
  private getYaml (type: ConfigDirType, name: keyof ConfigType) {
    const file =
      type === 'config'
        ? `${this.dirCfgPath}/${name}.yaml`
        : `${this.defCfgPath}/${name}.yaml`

    return requireFileSync(file, { force: true })
  }

  /**
   * 修改配置文件
   * @param name 文件名
   * @param key 键
   * @param value 值
   * @param type 配置文件类型，默认为用户配置文件 `config`
   */
  Modify (name: keyof ConfigType, key: string, value: any, type: ConfigDirType = 'config') {
    const filePath =
      type === 'config'
        ? `${this.dirCfgPath}/${name}.yaml`
        : `${this.defCfgPath}/${name}.yaml`

    const editor = new YamlEditor(filePath)
    editor.set(key, value)
    editor.save()
  }

  /**
   * 合并 YAML 对象，确保保留注释
   */
  mergeObjectsWithPriority (
    userEditor: YamlEditor,
    defaultEditor: YamlEditor
  ): { result: YamlEditor; differences: boolean } {
    let differences = false

    const mergeYamlNodes = (targetPath: string, sourceEditor: YamlEditor) => {
      const sourceData = sourceEditor.get(targetPath)
      const targetData = userEditor.get(targetPath)

      if (typeof targetData === 'object' && typeof sourceData === 'object') {
        for (const key in sourceData) {
          if (!(key in targetData)) {
            differences = true
            userEditor.set(`${targetPath ? `${targetPath}.` : ''}${key}`, sourceData[key])
          }
        }
      }
    }

    mergeYamlNodes('', defaultEditor)

    return { differences, result: userEditor }
  }
}

type Config = ConfigType & Pick<Cfg, 'All' | 'Modify'>

export const Config = new Proxy<Cfg & ConfigType>(
  Object.assign(new Cfg().initCfg(), {} as ConfigType),
  {
    get (target, prop: string) {
      if (prop in target) {
        return Reflect.get(target, prop)
      }
      return target.getDefOrConfig(prop as keyof ConfigType)
    }
  }
)
