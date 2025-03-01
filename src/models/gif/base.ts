import { exec } from 'node-karin'

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
