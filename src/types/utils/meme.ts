export interface ParserFlagsType {
  /** * 是否使用短标志，如选项名为 circle，表示是否使用 -c */
  short: boolean;
  /** * 是否使用长标志，如选项名为 circle，表示是否使用 --circle */
  long: boolean;
  /** * 其他短标志，不含 - */
  short_aliases: string[];
  /** * 其他长标志，不含 -- */
  long_aliases: string[];
}

export interface MemeOptionType {
  /** * 选项类型，可能值有 boolean、integer、float、string */
  type: 'boolean' | 'integer' | 'float' | 'string';
  /** * 选项名 */
  name: string;
  /** * 选项默认值，类型与选项类型对应 */
  default: boolean | number | string;
  /** * 选项描述 */
  description: string | null;
  /** * 选项命令行解析标志 */
  parser_flags: ParserFlagsType;
  /** * 选项可选值，仅当选项类型为 string 时存在 */
  choices: string[] | null;
  /** * 选项最小值，仅当选项类型为 integer 和 float 时存在 */
  minimum: number | null;
  /** * 选项最大值，仅当选项类型为 integer 和 float 时存在 */
  maximum: number | null;
}

export interface MemeParamsType {
  /** * 最小图片数目 */
  min_images: number;
  /** * 最大图片数目 */
  max_images: number;
  /** * 最小文本数目 */
  min_texts: number;
  /** * 最大文本数目 */
  max_texts: number;
  /** * 默认文本 */
  default_texts: string[];
  /** * 表情选项 */
  options: MemeOptionType[];
}

export interface MemeShortcutType {
  /** * 快捷指令特征，可能为正则表达式 */
  pattern: string;
  /** * 快捷指令人类友好表示 */
  humanized: string | null;
  /** * 快捷指令指向的图片名，可能包含格式化标志，如 "{name}" */
  names: string[];
  /** * 快捷指令指向的文本，可能包含格式化标志，如 "{text}" */
  texts: string[];
  /** * 快捷指令指向的选项，选项值中可能包含格式化标志，如 "{name}" */
  options: Record<string, any>;
}

/** * Meme 对象 */
export interface MemeInfoType {
  /** * 表情名 */
  key: string;
  /** * 表情参数信息 */
  params: MemeParamsType;
  /** * 表情关键词 */
  keywords: string[];
  /** * 表情快捷指令 */
  shortcuts: MemeShortcutType[];
  /** * 表情标签 */
  tags: string[];
  /** * 表情创建时间 */
  date_created: string;
  /** * 表情修改时间 */
  date_modified: string;
}
