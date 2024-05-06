import Router from 'koa-router'
import { BotEventSchema } from '@/bot/bot'
import { z } from 'zod'
import { number } from 'yargs'
import { Room, RoomReal } from '@/db/table'

export const router = new Router()

router.get('/plugins', async (ctx) => {
  ctx.body = $g.botPlugins.map((item) => item.name)
})

router.get('/bots', async (ctx) => {
  ctx.body = await $g.bot.GetLoggedAccountList()
})

router.post('/', async (ctx) => {
  // 结束请求，随便回复点东西
  ctx.body = 'ok'

  // 确认是机器人的消息
  try {
    const BotEvent = BotEventSchema.parse(ctx.request.body)

    if (BotEvent.msg === '#pingpong') {
      $g.bot.call({
        botWxid: BotEvent.robot_wxid,
        toWxid: BotEvent.from_wxid,
        payload: {
          event: 'SendTextMsg',
          msg: 'ok',
        },
      })
      return
    }

    // 自己发出的消息事件,比如你操作机器人微信发出了消息会触发该事件
    if (BotEvent.event === 'EventSendOutMsg') {
      return
    }

    // 处理群消息，个人暂不处理
    if (BotEvent.event === 'EventGroupMsg') {
      // 机器人自身发送的消息，统一不处理
      if (BotEvent.robot_wxid === BotEvent.final_from_wxid) {
        return
      }

      // 插件总开关
      let rooms = (await $g.db
        .selectFrom('room')
        .selectAll()
        .where('botWxid', '=', BotEvent.robot_wxid)
        .where('open', '=', '1')
        .execute()) as unknown as RoomReal[]

      const curRoom = rooms.find((item) => item.wxid === BotEvent.from_wxid)

      // 如果当前群没有监听，不处理
      if (!curRoom || curRoom.open === '0') {
        return
      }

      rooms.forEach((item) => {
        item.listenMembers = JSON.parse(item.listenMembers as unknown as string)
      })

      // 如果发言的成员未被监听，不处理
      if (
        !(
          curRoom.listenMembers.includes(BotEvent.final_from_wxid) ||
          curRoom.listenMembers.includes('-1')
        )
      ) {
        return
      }

      rooms.forEach((item) => {
        item.openPlugins = JSON.parse(item.openPlugins as unknown as string)
        item.transferGroups = item.transferGroups
          ? (item.transferGroups as unknown as string).split(',')
          : []
      })

      // 如果是采集模式，则不在此群发言
      if (curRoom.onlyListen === '1') {
        rooms = rooms.filter((item) => item.id !== curRoom.id)
      }

      // 根据当前群的信息，群分组
      // 如果只设置一个 0，是所有群都发，不需要处理
      // 先不考虑性能了。。。没太多时间搞
      if (curRoom.transferGroups.toString() !== '0') {
        rooms = rooms.filter((item) => {
          return curRoom.transferGroups.find((item2) => {
            return item.transferGroups.includes(item2)
          })
        })
      }

      // 只处理开启插件的群，把群列表分发给每个插件
      $g.botPlugins.forEach((plugin) => {
        if (curRoom.openPlugins.includes(plugin.name)) {
          plugin.handler(BotEvent, rooms)
        }
      })
    }
  } catch (e) {
    console.error(e)
  }
})
