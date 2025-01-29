import { common } from 'node-karin'


const Request = {
  async request (url) {
    await common.axios(url)
  }
}
