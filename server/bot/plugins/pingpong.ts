import { RoomReal } from '@/db/table'
import { BotPlugin, BotEvent } from '../bot'

export default class PingPongPlugin extends BotPlugin {
  constructor() {
    super()
  }

  order = -9999
  name = 'PingPong插件'

  async handler(event: BotEvent, groupRooms: RoomReal[]) {
    if (event.msg === 'ping') {
      for (const k in groupRooms) {
        const item = groupRooms[k]
        await $g.bot.call({
          botWxid: event.robot_wxid,
          toWxid: item.wxid,
          payload: {
            event: 'SendTextMsg',
            msg: 'pong😊推荐好友返5',
          },
        })
      }

      // $g.bot.batchTask(
      //   rooms.map((item) => {
      //     return () =>
      //       $g.bot.call({
      //         botWxid: event.robot_wxid,
      //         toWxid: item.wxid,
      //         payload: {
      //           event: 'SendTextMsg',
      //           msg: 'pong😊',
      //         },
      //       })
      //   }),
      // )
    }
  }
}
