import { BotPlugin, Bot } from './bot/bot'
import { db } from '@/db'

declare global {
  var $g: GlobalConext
}

interface GlobalConext {
  hello: string
  botPlugins: BotPlugin[]
  bot: Bot
  db: typeof db
  isDev: boolean
  port: number
}

globalThis.$g = <GlobalConext>{
  hello: '我是全局变量，正确的使用会事半功倍哦',
  botPlugins: [],
  bot: new Bot(),
  db,
  isDev: true,
  port: 0,
}
