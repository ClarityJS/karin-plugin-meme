export interface themeConfig {
  main: string;
  bg: string;
  style?: Record<string, any>;
}

export interface themeData {
  style: string;
  colCount: number;
}

export interface themeType {
  getThemeCfg: () => themeConfig;
  getThemeData: (diyStyle: any) => themeData;
}
