import { exec, readFile } from 'node-karin'

/**
 * 判断是否安装了ffmpeg
 * @returns 如果已安装则返回true，否则返回false
 */
export async function checkFFmpeg (): Promise<boolean> {
  const { status } = await exec('ffmpeg -version')

  if (!status) {
    return false
  }

  return true
}

/**
 * 检测图片是否是GIF格式
 * @param filePath 图片文件路径或者图片Buffer
 * @returns 如果是GIF图片返回true，否则返回false
*/
export async function isGifImage (input: Buffer | string): Promise<boolean> {
  try {
    let buffer: Buffer

    if (typeof input === 'string') {
      const fileBuffer = await readFile(input)
      if (!fileBuffer) {
        return false
      }
      buffer = fileBuffer
    } else {
      buffer = input
    }

    if (buffer.length < 6) {
      return false
    }
    const header = buffer.subarray(0, 6).toString('ascii')

    return header === 'GIF87a' || header === 'GIF89a'
  } catch (error) {
    return false
  }
}
