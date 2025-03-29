export interface ConfigItemBase {
  title: string;
  desc: string;
  type: 'boolean' | 'number' | 'string' | 'array';
}

export type ConfigItem =
  | (ConfigItemBase & {
    type: 'number';
    limit?: string;
  })
  | (ConfigItemBase & {
    type: 'boolean' | 'string' | 'array';
    limit?: never;
  })

export interface AdminConfigType {
  title: string;
  cfg: Record<string, ConfigItem>;
}
