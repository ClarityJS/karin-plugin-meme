export interface getLine {
  line: string;
}

export interface getChange {
  title: string;
  logs: string[];
}

export interface getTemp {
  version?: string;
  logs: getChange[];
}

export interface ChangeType {
  getLine: getLine;
  getChange: getChange;
  getTemp: getTemp
}

export interface VersionType {
  /** 当前Bot名称 */
  Bot_Name: string;
  /** 当前Bot版本 */
  Bot_Version: string;
  /** 插件包版本 */
  Plugin_Version: string;
  /** 插件包名称 */
  Plugin_Name: string;
  /** 插件包路径 */
  Plugin_Path: string;
  /** 插件包别名 */
  Plugin_AliasName: string;
  /** 插件包日志 */
  Plugin_Logs: getTemp[];
}
