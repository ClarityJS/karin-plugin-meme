export interface MemeParamsType {
  min_images: number;
  max_images: number;
  min_texts: number;
  max_texts: number;
  default_texts: string[];
  args_type: any | null;
}
export interface MemeData {
  key: string;
  params_type: MemeParamsType;
  keywords: string[];
  shortcuts: object[];
  tags: string[];
  date_created: string;
  date_modified: string;
}
