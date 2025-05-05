import { components } from 'node-karin'

import { Config } from '@/common'
import { utils } from '@/models'
import { pkg, Version } from '@/root'
import type { ConfigType } from '@/types'

async function createMemeList (value: string) {
  return await Promise.all(
    (await utils.get_meme_all_keywords() ?? []).map(async keyword => {
      const memeKey = await utils.get_meme_key_by_keyword(keyword)
      return components.checkbox.create(value, {
        label: keyword,
        value: memeKey!
      })
    })
  )
}

export default {
  info: {
    // 插件信息配置
    name: Version.Plugin_AliasName,
    description: '一个Karin版的表情包合成插件',
    author: [
      {
        name: pkg.author,
        home: pkg.homepage,
        avatar: 'https://avatars.githubusercontent.com/u/196008293'
      }
    ]
  },

  /** 动态渲染的组件 */
  components: async () => [
    components.accordion.create('server', {
      label: '服务设置',
      children: [
        components.accordion.createItem('server', {
          title: '服务设置',
          subtitle: '用于和服务相关的内容，如设置服务地址等',
          children: [
            components.input.create('url', {
              label: '服务地址',
              isRequired: false,
              description: '自定义表情服务地址',
              defaultValue: Config.server.url,
              rules: [
                {
                  regex: /^https?:\/\/((?:\d{1,3}\.){3}\d{1,3}|\w+\.\w{2,})(:\d{1,5})?$/i,
                  error: '请输入有效的URL地址'
                }
              ]
            }),
            components.input.number('timeout', {
              label: '超时时间',
              description: '超时时间，单位为秒',
              defaultValue: Config.server.timeout.toString()
            }),
            components.input.number('retry', {
              label: '重试次数',
              description: '重试次数',
              defaultValue: Config.server.retry.toString()
            })
          ]
        })
      ]
    }),
    components.accordion.create('meme', {
      label: '表情设置',
      children: [
        components.accordion.createItem('meme', {
          title: '表情设置',
          subtitle: '用于和表情相关的内容，如设置默认表情等',
          children: [
            components.switch.create('enable', {
              label: '默认表情',
              description: '是否开启设置本插件为默认表情',
              defaultSelected: Config.meme.enable
            }),
            components.switch.create('forceSharp', {
              label: '强制使用#触发',
              description: '是否强制使用#触发，开启后需要强制在指令前加#',
              defaultSelected: Config.meme.forceSharp
            }),
            components.switch.create('quotedImages', {
              label: '引用消息图片',
              description: '是否开启获取引用消息图片，关闭后无法获取引用消息的图片',
              defaultSelected: Config.meme.quotedImages
            }),
            components.switch.create('errorReply', {
              label: '错误回复',
              description: '是否开启错误回复，开启后会在错误时回复错误信息，关闭后只会在控制台输出错误信息',
              defaultSelected: Config.meme.errorReply
            })
          ]
        })
      ]
    }),
    components.accordion.create('access', {
      label: '名单设置',
      children: [
        components.accordion.createItem('access', {
          title: '名单设置',
          subtitle: '用于设置名单限制，如用户白名单、黑名单，禁用指定表情等',
          children: [
            components.switch.create('enable', {
              label: '名单限制',
              description: '是否名单限制',
              defaultSelected: Config.access.enable
            }),
            components.switch.create('blackListEnable', {
              label: '禁用表情列表',
              description: '是否开启禁用表情列表',
              defaultSelected: Config.access.blackListEnable
            }),
            components.radio.group('mode', {
              label: '名单限制模式',
              description: '名单限制模式',
              defaultValue: Config.access.mode.toString(),
              radio: [
                components.radio.create('white', {
                  label: '白名单',
                  value: '0'
                }),
                components.radio.create('black', {
                  label: '黑名单',
                  value: '1'
                })
              ]
            }),
            components.input.group('userWhiteList', {
              label: '用户白名单',
              description: '用户白名单',
              data: Config.access.userWhiteList,
              template: components.input.string('userWhiteList', {
                placeholder: '114514',
                label: '',
                color: 'primary'
              })
            }),
            components.input.group('userBlackList', {
              label: '用户黑名单',
              description: '用户黑名单',
              data: Config.access.userBlackList,
              template: components.input.string('userBlackList', {
                placeholder: '114514',
                label: '',
                color: 'primary'
              })
            }),
            components.checkbox.group('blackList', {
              label: '禁用表情列表',
              description: '选择要禁用的表情',
              defaultValue: Config.access.blackList,
              checkbox: await createMemeList('blackList')
            })
          ]
        })
      ]
    }),
    components.accordion.create('protect', {
      label: '表情保护设置',
      children: [
        components.accordion.createItem('protect', {
          title: '表情保护设置',
          subtitle: '用于设置表情保护等功能',
          children: [
            components.switch.create('enable', {
              label: '表情保护',
              description: '是否开启表情保护',
              defaultSelected: Config.protect.enable
            }),
            components.switch.create('master', {
              label: '主人保护',
              description: '是否开启主人保护，开启后才会进行主人保护',
              defaultSelected: Config.protect.master
            }),
            components.switch.create('userEnable', {
              label: '用户保护',
              description: '是否开启用户保护，开启后才会进行用户保护',
              defaultSelected: Config.protect.userEnable
            }),
            components.input.group('user', {
              label: '其他用户保护列表',
              description: '其他用户保护列表',
              data: Config.protect.user,
              template: components.input.string('user', {
                placeholder: '114514',
                label: '',
                color: 'primary'
              })
            }),
            components.checkbox.group('list', {
              label: '保护表情列表',
              description: '选择要保护的表情',
              defaultValue: Config.protect.list,
              checkbox: await createMemeList('list')
            })
          ]
        })
      ]
    }),
    components.accordion.create('stst', {
      label: '统计设置',
      children: [
        components.accordion.createItem('stat', {
          title: '统计设置',
          subtitle: '用于和统计相关的内容，如开启统计等',
          children: [
            components.switch.create('enable', {
              label: '统计',
              description: '是否开启统计',
              defaultSelected: Config.stat.enable
            })
          ]
        })
      ]
    }),
    components.accordion.create('other', {
      label: '其他设置',
      children: [
        components.accordion.createItem('other', {
          title: '其他设置',
          subtitle: '用于和其他相关的内容，如设置渲染精度等',
          children: [
            components.input.number('renderScale', {
              label: '渲染精度',
              description: '渲染精度，数字越大越清晰，但越耗性能',
              defaultValue: Config.other.renderScale.toString(),
              rules: [
                {
                  min: 100,
                  max: 200,
                  error: '数字应在100-200之间'
                },
                {
                  regex: /^\d+$/,
                  error: '只能输入数字'
                }
              ]
            })
          ]
        })
      ]
    })
  ],

  /** 前端点击保存之后调用的方法 */

  /** 这里简写了一下后面再改 */
  save: (newConfig: ConfigType) => {
    console.log('新配置:', newConfig)
    let success = false
    try {
      const currentConfig = Config.All()

      for (const [configKey, entries] of Object.entries(newConfig)) {
        for (const entry of entries) {
          for (let [key, value] of Object.entries(entry)) {
            const originalValue = (currentConfig as Record<string, any>)[configKey]?.[key]
            if (typeof value === 'string' && value.trim() === '') {
              value = ''
            } else if (typeof originalValue === 'number' && typeof value === 'string') {
              const numValue = Number(value)
              if (!isNaN(numValue)) {
                value = numValue
              }
            } else if (typeof originalValue === 'boolean' && typeof value === 'string') {
              value = value === 'true'
            } else if (originalValue === null) {
              value = null
            } else if (typeof originalValue === 'object' && typeof value === 'string') {
              try {
                value = JSON.parse(value)
              } catch {
              }
            }

            Config.Modify(configKey as keyof ConfigType, key, value)
          }
        }
      }

      success = true
    } catch (error) {
      success = false
    }
    return {
      success,
      message: success ? 'ฅ^•ﻌ•^ฅ 喵呜~ 配置保存成功啦~' : '(╥﹏╥) 呜喵... 保存失败了，请检查一下下~'
    }
  }
}
