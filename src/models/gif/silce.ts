import fs from 'node:fs/promises'

import gifFrames from 'gif-frames'
import { basePath, exec, existToMkdirSync, stream } from 'node-karin'

import { Version } from '@/common'
import * as base from '@/models/gif/base'

/**
 * 解析 GIF 并提取每一帧为 PNG Buffer 数组
 * @param image GIF 图像的 Buffer
 * @returns 每一帧对应的 PNG Buffer 数组
 */
export async function slice (image: Buffer): Promise<Buffer[]> {
  if (!(await base.checkFFmpeg())) {
    try {
      const frameData = await gifFrames({ url: image, frames: 'all', outputType: 'png' })

      const frames: Buffer[] = await Promise.all(
        frameData.map(async (frame) => {
          return stream(frame.getImage())
        })
      )

      return frames
    } catch (error) {
      throw new Error(`解析 GIF 时出错，请稍后再试, 错误信息: ${error}`)
    }
  } else {
    const gifDir = `${basePath}/${Version.Plugin_Name}/data/gif/`
    existToMkdirSync(gifDir)

    const gifPath = `${gifDir}/input.gif`

    try {
      await fs.writeFile(gifPath, image)

      const outputDir = `${gifDir}/output`
      existToMkdirSync(outputDir)

      const framePattern = `${outputDir}/frame_%04d.png`
      await exec(`ffmpeg -i ${gifPath} -vsync 0 -f image2 ${framePattern}`)

      const files = await fs.readdir(outputDir)
      const frameBuffers = await Promise.all(
        files
          .filter((file) => file.endsWith('.png'))
          .sort((a, b) => a.localeCompare(b))
          .map(async (file) => fs.readFile(`${outputDir}/${file}`))
      )
      /**
       * 删除临时文件
       */
      await fs.rm(outputDir, { recursive: true })
      await fs.rm(gifPath)

      return frameBuffers
    } catch (error) {
      throw new Error(`使用 FFmpeg 解析 GIF 时出错: ${error}`)
    }
  }
}
