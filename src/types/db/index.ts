import { memeType } from '@/types/db/meme'
import { presetType } from '@/types/db/preset'

export interface dbType {
  meme: memeType
  preset: presetType
}
