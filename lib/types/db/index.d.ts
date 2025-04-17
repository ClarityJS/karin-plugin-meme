import { memeType } from '../../types/db/meme.js';
import { presetType } from '../../types/db/preset.js';
import { statType } from '../../types/db/stat.js';
export interface dbType {
    meme: memeType;
    preset: presetType;
    stat: statType;
}
