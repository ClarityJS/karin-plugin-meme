import { helpCfg } from '../../types/help/config.js';
import { groupList } from '../../types/help/list.js';
import { themeType } from '../../types/help/theme.js';
export interface HelpType {
    helpCfg: helpCfg;
    helpList: groupList[];
    theme: themeType;
}
