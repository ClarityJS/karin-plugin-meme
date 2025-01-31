export interface group {
  css?: string;
  icon: number;
  title: string;
  desc: string;
}

export interface groupList {
  group: string;
  auth?: string;
  list?: group[];
}
