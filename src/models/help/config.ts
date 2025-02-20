import { Version } from '@/common'
import { BaseType } from '@/types'

type HelpType = BaseType['help']

export const helpCfg:HelpType ['helpCfg'] = {
  title: `${Version.Plugin_AliasName}帮助`,
  subTitle: Version.Plugin_Name,
  columnCount: 3,
  colWidth: 265,
  theme: 'all',
  style: {
    fontColor: '#d3bc8e',
    descColor: '#eee',
    contBgColor: 'rgba(6, 21, 31, .5)',
    contBgBlur: 3,
    headerBgColor: 'rgba(6, 21, 31, .4)',
    rowBgColor1: 'rgba(6, 21, 31, .2)'
  }
}
