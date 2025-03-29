import fs from 'node:fs/promises'

import gifFrames from 'gif-frames'
import { exec, existToMkdirSync, karinPathBase, stream } from 'node-karin'

import { Version } from '@/common'
import * as base from '@/models/gif/base'

/**
 * 入口函数：解析 GIF 并提取帧
 * @param image GIF 图像的 Buffer
 * @returns 提取出的帧数据
 */
export async function slice (image: Buffer): Promise<Buffer[]> {
  const hasFFmpeg = await base.checkFFmpeg()

  if (hasFFmpeg) {
    try {
      return await sliceWithFFmpeg(image)
    } catch (error) {
      console.warn(`FFmpeg 解析失败，回退到 gif-frames: ${error}`)
    }
  }

  return await sliceWithGifFrames(image)
}

/**
 * 使用 FFmpeg 解析 GIF 并提取帧
 * @param image GIF 图像的 Buffer
 * @returns  提取的帧数据
 */
async function sliceWithFFmpeg (image: Buffer): Promise<Buffer[]> {
  const timestamp = Date.now()
  const gifDir = `${karinPathBase}/${Version.Plugin_Name}/data/gif/`
  existToMkdirSync(gifDir)

  const gifPath = `${gifDir}/silce_input_${timestamp}.gif`
  const outputDir = `${gifDir}/silce_output_${timestamp}`
  const framePattern = `${outputDir}/frame_%04d.png`

  try {
    await fs.writeFile(gifPath, image)
    existToMkdirSync(outputDir)

    await exec(`ffmpeg -i ${gifPath} -vsync 0 -f image2 ${framePattern}`)

    const files = await fs.readdir(outputDir)
    const frames = await Promise.all(
      files
        .filter(file => file.endsWith('.png'))
        .sort((a, b) => a.localeCompare(b))
        .map(file => fs.readFile(`${outputDir}/${file}`))
    )

    await fs.rm(outputDir, { recursive: true, force: true })
    await fs.rm(gifPath, { force: true })

    if (frames.length < 2) {
      throw new Error('FFmpeg 提取的帧数不足')
    }

    return frames
  } catch (error) {
    throw new Error(`FFmpeg 解析失败: ${error}`)
  }
}

/**
 * 使用 gif-frames 解析 GIF 并提取帧
 * @param image GIF 图像的 Buffer
 * @returns  提取的帧数据
 */
async function sliceWithGifFrames (image: Buffer): Promise<Buffer[]> {
  try {
    const frameData = await gifFrames({ url: image, frames: 'all', outputType: 'png' })
    const frames = await Promise.all(frameData.map(frame => stream(frame.getImage())))

    if (frames.length < 2) {
      throw new Error('gif-frames 提取的帧数不足')
    }

    return frames
  } catch (error) {
    throw new Error(`gif-frames 解析失败: ${error}`)
  }
}
