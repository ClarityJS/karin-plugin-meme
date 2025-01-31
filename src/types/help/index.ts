import { helpCfg } from './config'
import { groupList } from './list'
import { themeType } from './theme'

export interface HelpType {
  helpCfg: helpCfg;
  helpList: groupList[];
  theme: themeType;
}
