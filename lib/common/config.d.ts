import { YamlEditor } from 'node-karin';
import { BaseType } from '../types/index.js';
type ConfigDirType = 'config' | 'defSet';
type ConfigType = BaseType['config'];
declare class Cfg {
    /** 用户配置文件路径 */
    private dirCfgPath;
    /** 默认配置文件路径 */
    private defCfgPath;
    constructor();
    /** 初始化配置 */
    initCfg(): this;
    /**
     * 获取默认配置和用户配置
     * @param name 配置文件名
     * @returns 返回合并后的配置
     */
    getDefOrConfig(name: keyof ConfigType): any;
    /** 获取所有配置文件 */
    All(): ConfigType;
    /**
     * 获取 YAML 文件内容
     * @param type 配置文件类型
     * @param name 配置文件名
     * @returns 返回 YAML 文件内容
     */
    private getYaml;
    /**
     * 修改配置文件
     * @param name 文件名
     * @param key 键
     * @param value 值
     * @param type 配置文件类型，默认为用户配置文件 `config`
     */
    Modify(name: keyof ConfigType, key: string, value: any, type?: ConfigDirType): void;
    /**
     * 合并 YAML 对象，确保保留注释
     */
    mergeObjectsWithPriority(userEditor: YamlEditor, defaultEditor: YamlEditor): {
        result: YamlEditor;
        differences: boolean;
    };
}
export declare const Config: Cfg & import("../types/config/index.js").ConfigType;
export {};
