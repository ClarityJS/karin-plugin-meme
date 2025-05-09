import { HelpType } from '@/types'
type HelpListType = HelpType['helpList']

export const helpList:HelpListType = [
  {
    group: '[]内为必填项,{}内为可选项'
  },
  {
    group: '表情命令',
    list: [
      {
        icon: 161,
        title: '#柠糖表情列表',
        desc: '获取表情列表'
      },
      {
        icon: 90,
        title: '#柠糖表情搜索xx',
        desc: '搜指定的表情'
      },
      {
        icon: 75,
        title: '#柠糖表情详情xx',
        desc: '获取指定表情详情'
      },
      {
        icon: 76,
        title: '#随机表情',
        desc: '随机生成一个表情'
      },
      {
        icon: 71,
        title: 'xx',
        desc: '如喜报xx (参数使用#,多个参数同样使用#, 多段文本使用/, 指定用户头像使用@+qq号)'
      }
    ]
  },
  {
    group: '管理命令，仅主人可用',
    auth: 'master',
    list: [
      {
        icon: 95,
        title: '#柠糖表情(插件)更新',
        desc: '更新插件本体'
      },
      {
        icon: 81,
        title: '#柠糖表情更新表情资源',
        desc: '更新表情资源'
      },
      {
        icon: 85,
        title: '#柠糖表情设置',
        desc: '管理命令'
      }
    ]
  }
]
