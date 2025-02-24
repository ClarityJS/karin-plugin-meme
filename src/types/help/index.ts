import { helpCfg } from '@/types/help/config'
import { groupList } from '@/types/help/list'
import { themeType } from '@/types/help/theme'

export interface HelpType {
  helpCfg: helpCfg;
  helpList: groupList[];
  theme: themeType;
}
