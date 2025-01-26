import { helpCfg } from './config.js';
import { groupList } from './list.js';
import { themeType } from './theme.js';
export interface HelpType {
    helpCfg: helpCfg;
    helpList: groupList[];
    theme: themeType;
}
