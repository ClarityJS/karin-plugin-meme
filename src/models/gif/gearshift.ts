import fs from 'node:fs/promises'

import { createCanvas, loadImage } from '@napi-rs/canvas'
import gifFrames from 'gif-frames'
import { BitmapImage, GifCodec, GifFrame, GifFrameOptions } from 'gifwrap'
import { basePath, exec, existToMkdirSync, stream } from 'node-karin'

import { Version } from '@/common'
import * as base from '@/models/gif/base'

/**
 * 调整 GIF 速度
 * @param image GIF Buffer
 * @param speed 速度倍率，必须大于 0
 * @returns 处理后的 GIF Buffer
 */
export async function gearshift (image: Buffer, speed: number): Promise<Buffer> {
  if (speed <= 0) {
    throw new Error('速度倍数必须大于 0')
  }

  const hasFFmpeg = await base.checkFFmpeg()

  if (hasFFmpeg) {
    return await adjustGifSpeedWithFFmpeg(image, speed)
  } else {
    return await adjustGifSpeedWithGifwrap(image, speed)
  }
}

/**
 * 使用 FFmpeg 调整 GIF 速度
 * @param image GIF Buffer
 * @param speed 速度倍率
 * @returns 处理后的 GIF Buffer
 */
async function adjustGifSpeedWithFFmpeg (image: Buffer, speed: number): Promise<Buffer> {
  const timestamp = Date.now()
  const gifDir = `${basePath}/${Version.Plugin_Name}/data/gif/`
  existToMkdirSync(gifDir)

  const inputGifPath = `${gifDir}/gearshift_input_${timestamp}.gif`
  const outputGifPath = `${gifDir}/gearshift_output_${timestamp}.gif`

  try {
    await fs.writeFile(inputGifPath, image)
    await exec(`ffmpeg -i ${inputGifPath} -filter_complex "[0:v]setpts=${(1 / speed)}*PTS[v]" -map "[v]" -y ${outputGifPath}`)
    const outputBuffer = await fs.readFile(outputGifPath)
    await fs.rm(inputGifPath, { force: true })
    await fs.rm(outputGifPath, { force: true })

    return outputBuffer
  } catch (error) {
    console.error('FFmpeg 处理 GIF 失败:', error)
    throw new Error('FFmpeg 处理 GIF 失败，请检查 FFmpeg 是否可用')
  }
}

/**
 * 使用 gifwrap 解析 GIF 并调整速度
 * @param image GIF Buffer
 * @param speed 速度倍率
 * @returns 处理后的 GIF Buffer
 */
async function adjustGifSpeedWithGifwrap (image: Buffer, speed: number): Promise<Buffer> {
  try {
    const frameData = await gifFrames({ url: image, frames: 'all', outputType: 'png' })
    const frames = await Promise.all(frameData.map(frame => stream(frame.getImage())))
    const delays = frameData.map(frame => frame.frameInfo?.delay || 10)
    const disposals = frameData.map(frame => frame.frameInfo?.disposal ?? 2)

    if (frames.length < 2) {
      throw new Error('提供的图片不是 GIF，至少需要包含两帧')
    }

    const width = frameData[0].frameInfo.width
    const height = frameData[0].frameInfo.height

    const codec = new GifCodec()

    const GifFrames: GifFrame[] = await Promise.all(
      frames.map(async (frameBuffer, index) => {
        const image = await loadImage(frameBuffer)
        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d', { alpha: true })

        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = 'rgba(0,0,0,0)'
        ctx.fillRect(0, 0, width, height)

        ctx.drawImage(image, 0, 0, width, height)

        const imageData = ctx.getImageData(0, 0, width, height)
        const buffer = Buffer.from(imageData.data)
        const bitmap = new BitmapImage(width, height, buffer)
        const adjustedDelay = Math.max(1, Math.round(delays[index] / speed))

        return new GifFrame(bitmap, {
          delayCentisecs: adjustedDelay,
          disposalMethod: disposals[index]
        } as GifFrameOptions)
      })
    )

    const encodedGif = await codec.encodeGif(GifFrames, { loops: 0 })
    return Buffer.from(encodedGif.buffer)
  } catch (error) {
    throw new Error(`解析 GIF 时出错，请稍后再试, 错误信息: ${error}`)
  }
}
