import fs from 'node:fs/promises'

import gifFrames from 'gif-frames'
import { basePath, exec, existToMkdirSync, stream } from 'node-karin'

import { Version } from '@/common'
import * as base from '@/models/gif/base'

/**
 * 解析 GIF 并提取每一帧为 PNG Buffer 数组，同时返回帧延迟
 * @param image GIF 图像的 Buffer
 * @returns {frames: Buffer[], delays: number[]} 帧数据和每帧的延迟（centiseconds）
 */
export async function slice (image: Buffer): Promise<{ frames: Buffer[], delays: number[] }> {
  let frames: Buffer[] = []
  let delays: number[] = []
  const hasFFmpeg = await base.checkFFmpeg()

  if (hasFFmpeg) {
    const gifDir = `${basePath}/${Version.Plugin_Name}/data/gif/`
    existToMkdirSync(gifDir)

    const gifPath = `${gifDir}/input.gif`
    const outputDir = `${gifDir}/output`
    const framePattern = `${outputDir}/frame_%04d.png`

    try {
      await fs.writeFile(gifPath, image)
      existToMkdirSync(outputDir)

      await exec(`ffmpeg -i ${gifPath} -vsync 0 -f image2 ${framePattern}`)

      const files = await fs.readdir(outputDir)
      frames = await Promise.all(
        files
          .filter(file => file.endsWith('.png'))
          .sort((a, b) => a.localeCompare(b))
          .map(file => fs.readFile(`${outputDir}/${file}`))
      )

      // FFmpeg 不能直接解析帧延迟，所以我们暂时用 10cs 默认值
      delays = new Array(frames.length).fill(10)

      await fs.rm(outputDir, { recursive: true, force: true })
      await fs.rm(gifPath, { force: true })
    } catch (error) {
      console.warn(`FFmpeg 解析失败，尝试使用 gif-frames: ${error}`)
    }
  }

  if (frames.length === 0) {
    try {
      const frameData = await gifFrames({ url: image, frames: 'all', outputType: 'png' })

      frames = await Promise.all(frameData.map(frame => stream(frame.getImage())))
      delays = frameData.map(frame => frame.frameInfo?.delay || 10) // 获取每帧延迟
    } catch (error) {
      throw new Error(`解析 GIF 时出错，请稍后再试, 错误信息: ${error}`)
    }
  }

  if (frames.length < 2) {
    throw new Error('提供的图片不是 GIF，至少需要包含两帧')
  }

  return { frames, delays }
}
