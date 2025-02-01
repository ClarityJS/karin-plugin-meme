import Common from './common'
import Request from './request'
import Tools from './tools'

const Utils: { Request: typeof Request; Tools: typeof Tools, Common: typeof Common } = {
  Request,
  Tools,
  Common
}

export { Utils }
