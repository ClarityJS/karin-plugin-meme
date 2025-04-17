import { db } from '../../models/index.js';
type Model = db.base.Model;
export interface statType extends Model {
    /** 表情键值 */
    key: string;
    /** 表情使用次数 */
    all: number;
}
export {};
