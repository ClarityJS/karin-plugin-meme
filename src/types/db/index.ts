import { memeType } from '@/types/db/meme'
import { presetType } from '@/types/db/preset'
import { statType } from '@/types/db/stat'

export interface dbType {
  meme: memeType,
  preset: presetType,
  stat: statType,

}
