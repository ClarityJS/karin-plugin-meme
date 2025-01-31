import Request from './request'
import Tools from './tools'

const Utils: { Request: typeof Request; Tools: typeof Tools } = {
  Request,
  Tools
}

export { Utils }
