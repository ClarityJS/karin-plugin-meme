import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { exists, logger, mkdir, readFile } from 'node-karin'
import TOML from 'smol-toml'

import { get_meme_server_name, get_meme_server_path } from '@/models/server/utils'
import type { MemeServerConfigType } from '@/types'

let serverProcess: ReturnType<typeof spawn> | null = null

const config: MemeServerConfigType = {
  meme: {
    load_builtin_memes: true,
    load_external_memes: false,
    meme_disabled_list: []
  },
  resource: {
    resource_url: 'https://cdn.jsdelivr.net/gh/MemeCrafters/meme-generator-rs@',
    download_fonts: true
  },
  font: {
    use_local_fonts: true,
    default_font_families: ['Noto Sans SC', 'Noto Color Emoji']
  },
  encoder: {
    gif_max_frames: 200,
    gif_encode_speed: 1
  },
  api: {
    baidu_trans_appid: '',
    baidu_trans_apikey: ''
  },
  server: {
    host: '0.0.0.0',
    port: 2233
  }
}

/**
 * 启动表情服务端
 * @param port - 端口
 * @returns 启动结果
 */

export async function start (port: number = 2233) {
  try {
    const configDir = path.join(os.homedir(), '.meme_generator')
    const configPath = path.join(configDir, 'config.toml')
    if (!await exists(configDir)) {
      await mkdir(configPath)
    }
    if (!await exists(configPath)) {
      const defaultConfig = TOML.stringify(config)
      await fs.writeFile(configPath, defaultConfig)
    }
    const configContentBuffer = await readFile(configPath)
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const configContent = configContentBuffer?.toString().trim() || TOML.stringify(config)
    const configData = TOML.parse(configContent) as unknown as MemeServerConfigType
    configData.server.port = port
    const newConfigData = TOML.stringify(configData)
    await fs.writeFile(configPath, newConfigData)
    const memeServerPath = path.join(`${get_meme_server_path()}/${get_meme_server_name()}`)
    if (!memeServerPath) {
      throw new Error('未找到表情服务端文件')
    }
    serverProcess = spawn(memeServerPath, ['run'], { stdio: 'inherit' })
    serverProcess.on('error', (error) => {
      logger.error(error)
      throw new Error(`启动服务器失败: ${(error).message}`)
    })
  } catch (error) {
    logger.error(error)
    throw new Error(`启动服务器失败: ${(error as Error).message}`)
  }
}

/**
 * 停止表情服务端
 * @returns 停止结果
 */
export async function stop () {
  try {
    if (serverProcess) {
      await new Promise<void>((resolve, reject) => {
        serverProcess!.on('exit', resolve)
        serverProcess!.on('error', reject)
        serverProcess!.kill()
      })
      serverProcess = null
    } else {
      throw new Error('表情服务端未运行')
    }
  } catch (error) {
    logger.error(error)
    throw new Error(`停止服务器失败: ${(error as Error).message}`)
  }
}

/**
 * 重启表情服务端
 * @returns 重启结果
 */
export async function restart () {
  try {
    if (serverProcess) {
      await stop()
    }
    await start()
  } catch (error) {
    logger.error(error)
    throw new Error(`重启服务器失败: ${(error as Error).message}`)
  }
}
