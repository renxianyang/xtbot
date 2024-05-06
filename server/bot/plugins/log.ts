import { BotPlugin, BotEvent } from '../bot'

export default class DocPlugin extends BotPlugin {
  constructor() {
    super()
  }

  order = -9999
  name = '日志插件'

  async handler(event: BotEvent) {
    // console.info(`收到消息：`, event)
  }
}
