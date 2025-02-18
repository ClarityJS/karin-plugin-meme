import { components } from 'node-karin';
import { Config } from './common/index.js';
export default {
    info: {
    // 插件信息配置
    },
    /** 动态渲染的组件 */
    components: () => [
        components.accordion.create('Config.server', {
            children: [
                components.accordion.createItem('server', {
                    title: '服务设置',
                    children: [
                        components.input.url('url', {
                            label: '服务地址',
                            isRequired: false,
                            type: 'url',
                            description: '自定义表情服务地址',
                            defaultValue: Config.server.url ? '0' : ''
                        }),
                        components.input.number('timeout', {
                            label: '超时时间',
                            description: '超时时间，单位为秒',
                            defaultValue: Config.server.timeout.toString()
                        }),
                        components.input.create('retry', {
                            label: '重试次数',
                            description: '重试次数',
                            defaultValue: Config.server.retry.toString()
                        })
                    ]
                })
            ]
        }),
        components.accordion.create('Config.meme', {
            children: [
                components.accordion.createItem('meme', {
                    title: '表情设置',
                    children: [
                        components.switch.create('enable', {
                            startText: '设置本插件为默认表情',
                            endText: '关闭本插件为默认表情',
                            defaultSelected: Config.meme.enable
                        }),
                        components.switch.create('forceSharp', {
                            startText: '开启强制使用#触发',
                            endText: '关闭强制使用#触发',
                            defaultSelected: Config.meme.forceSharp
                        })
                    ]
                })
            ]
        }),
        components.accordion.create('Config.other', {
            children: [
                components.accordion.createItem('other', {
                    title: '其他设置',
                    children: [
                        components.input.number('renderScale', {
                            label: '渲染精度',
                            description: '渲染精度，数字越大越清晰，但越耗性能',
                            defaultValue: Config.other.renderScale.toString(),
                            rules: [
                                {
                                    min: 100,
                                    max: 200,
                                    error: '数字应在100-200之间'
                                },
                                {
                                    regex: /^\d+$/,
                                    error: '只能输入数字'
                                }
                            ]
                        })
                    ]
                })
            ]
        })
    ],
    /** 前端点击保存之后调用的方法 */
    /** 这里简写了一下后面再改 */
    save: (newConfig) => {
        console.log('新配置:', newConfig);
        try {
            const currentConfig = Config.All();
            for (const [configKey, entries] of Object.entries(newConfig)) {
                const fileName = configKey.replace('Config.', '');
                if (!fileName)
                    continue;
                for (const entry of entries) {
                    for (let [key, value] of Object.entries(entry)) {
                        key = key.replace(`${fileName}.`, '');
                        const originalValue = currentConfig[fileName]?.[key];
                        if (typeof value === 'string' && value.trim() === '') {
                            value = '';
                        }
                        else if (typeof originalValue === 'number' && typeof value === 'string') {
                            const numValue = Number(value);
                            if (!isNaN(numValue)) {
                                value = numValue;
                            }
                        }
                        else if (typeof originalValue === 'boolean' && typeof value === 'string') {
                            value = value === 'true';
                        }
                        else if (originalValue === null) {
                            value = null;
                        }
                        else if (typeof originalValue === 'object' && typeof value === 'string') {
                            try {
                                value = JSON.parse(value);
                            }
                            catch {
                            }
                        }
                        Config.Modify(fileName, key, value);
                    }
                }
            }
            return {
                success: true,
                message: '✅ 配置保存成功'
            };
        }
        catch (error) {
            console.error('配置保存失败:', error);
            return {
                success: false,
                message: `❌ 保存失败: ${error instanceof Error ? error.message : '未知错误'}`
            };
        }
    }
};
