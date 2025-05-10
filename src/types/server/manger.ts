/**
 * Meme 相关配置
 */
interface MemeConfig {
  /** 是否加载内置表情包 */
  load_builtin_memes: boolean;
  /** 是否加载外部表情包 */
  load_external_memes: boolean;
  /** 禁用的表情包列表，填写表情的 key */
  meme_disabled_list: string[];
}

/**
 * 资源相关配置
 */
interface ResourceConfig {
  /** 下载内置表情包图片/字体时的资源链接 */
  resource_url: string;
  /** 是否下载字体 */
  download_fonts: boolean;
}

/**
 * 字体相关配置
 */
interface FontConfig {
  /** 是否使用本地文件夹下的字体 */
  use_local_fonts: boolean;
  /** 默认字体列表 */
  default_font_families: string[];
}

/**
 * 编码器相关配置
 */
interface EncoderConfig {
  /** 限制生成的 gif 帧数 */
  gif_max_frames: number;
  /** gif 编码速度，范围为 1 ~ 30，数字越大，编码速度越快，但图片质量越差 */
  gif_encode_speed: number;
}

/**
 * API 相关配置
 */
interface ApiConfig {
  /** 百度翻译 API ID */
  baidu_trans_appid: string;
  /** 百度翻译 API Key */
  baidu_trans_apikey: string;
}

/**
 * 服务器相关配置
 */
interface ServerConfig {
  /** web server 监听地址 */
  host: string;
  /** web server 端口 */
  port: number;
}

/**
 * 总配置接口
 */
export interface MemeServerConfigType {
  /** Meme 配置 */
  meme: MemeConfig;
  /** 资源配置 */
  resource: ResourceConfig;
  /** 字体配置 */
  font: FontConfig;
  /** 编码器配置 */
  encoder: EncoderConfig;
  /** API 配置 */
  api: ApiConfig;
  /** 服务器配置 */
  server: ServerConfig;
}
