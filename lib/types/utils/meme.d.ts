export interface UserInfo {
    properties: {
        name: {
            default: string;
            title: string;
            type: 'string';
        };
        gender: {
            default: string;
            enum: string[];
            title: string;
            type: 'string';
        };
    };
    title: string;
    type: 'object';
}
export interface ArgsModel {
    $defs: {
        UserInfo: UserInfo;
    };
    properties: {
        user_infos: {
            default: UserInfo[];
            items: {
                $ref: string;
            };
            title: string;
            type: 'array';
        };
        character: {
            default: number;
            description: string;
            title: string;
            type: 'integer';
        };
        position: {
            default: string;
            description: string;
            enum: string[];
            title: string;
            type: 'string';
        };
    };
    title: string;
    type: 'object';
}
export interface ArgsExample {
    user_infos: UserInfo[];
    character: number;
    position: string;
}
export interface ParserArg {
    name: string;
    value: string;
    default: any;
    flags: any;
}
export interface ParserAction {
    type: number;
    value: string;
}
export interface ParserOption {
    names: string[];
    args?: ParserArg[] | null;
    dest?: string | null;
    default?: any;
    action?: ParserAction | null;
    help_text?: string | null;
    compact: boolean;
}
export interface ArgsType {
    args_model: ArgsModel;
    args_examples: ArgsExample[];
    parser_options: ParserOption[];
}
export interface MemeParamsType {
    min_images: number;
    max_images: number;
    min_texts: number;
    max_texts: number;
    default_texts: string[];
    args_type: ArgsType | null;
}
export interface ArgsModel {
    $defs: {
        UserInfo: UserInfo;
    };
    properties: {
        user_infos: {
            default: UserInfo[];
            items: {
                $ref: string;
            };
            title: string;
            type: 'array';
        };
        character: {
            default: number;
            description: string;
            title: string;
            type: 'integer';
        };
        position: {
            default: string;
            description: string;
            enum: string[];
            title: string;
            type: 'string';
        };
    };
    title: string;
    type: 'object';
}
export interface UserInfo {
    properties: {
        name: {
            default: string;
            title: string;
            type: 'string';
        };
        gender: {
            default: string;
            enum: string[];
            title: string;
            type: 'string';
        };
    };
    title: string;
    type: 'object';
}
export interface ArgsExample {
    user_infos: UserInfo[];
    character: number;
    position: string;
}
export interface ParserArg {
    name: string;
    value: string;
    default: any;
    flags: any;
}
export interface ParserOption {
    names: string[];
    args?: ParserArg[] | null;
    dest?: string | null;
    default?: any;
    action?: ParserAction | null;
    help_text?: string | null;
    compact: boolean;
}
export interface ParserAction {
    type: number;
    value: string;
}
export interface Shortcut {
    key: string;
    args: string[];
    humanized: string | null;
}
export interface MemeData {
    key: string;
    params_type: MemeParamsType;
    keywords: string[];
    shortcuts: Shortcut[];
    tags: string[];
    date_created: string;
    date_modified: string;
}
