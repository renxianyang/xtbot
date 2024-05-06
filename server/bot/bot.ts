import { Room, RoomReal } from '@/db/table'
import { z } from 'zod'

/**
 # 收到消息
 {
    "event":"EventGroupMsg",//事件标示(当前值为群消息事件)
    "robot_wxid":"wxid_5hxa04j4z6pg22",//机器人wxid
    "robot_name":"",//机器人昵称，一般为空
    "type":1,//1/文本消息 3/图片消息 34/语音消息  42/名片消息  43/视频 47/动态表情 48/地理位置  49/分享链接  2000/转账 2001/红包  2002/小程序  2003/群邀请
    "from_wxid":"18900134932@chatroom",//群id，群消息事件才有
    "from_name":"微群测",//群名字
    "final_from_wxid":"sundreamer",//发该消息的用户微信id
    "final_from_name":"遗忘悠剑o",//微信昵称
    "to_wxid":"wxid_5hxa04j4z6pg22",//接收消息的人id，（一般是机器人收到了，也有可能是机器人发出的消息，别人收到了，那就是别人）
    "msg":"图片https://b3logfile.com/bing/20201024.jpg",//消息内容(string/array) 使用时候根据不同的事件标示来定义这个值，字符串类型或者数据类型
    "money":0.01 //金额，只有"EventReceivedTransfer"事件才有该参数
  }

  # 发送消息
  {
    "success":true,//true时，http-sdk才处理，false直接丢弃
    "message":"successful!",
    "event":"SendImageMsg",//告诉它干什么，SendImageMsg是发送图片事件
    "robot_wxid":"wxid_5hxa04j4z6pg22",//用哪个机器人发
    "to_wxid":"18900134932@chatroom",//发到哪里？群/好友
    "member_wxid":"",
    "member_name":"",
    "group_wxid":"",
    "msg":{//消息内容:发送 图片、视频、文件、动态表情都是这个结构
        "url":"https:\/\/b3logfile.com\/bing\/20201024.jpg",
        "name":"20201024.jpg"//带有扩展名的文件名，建议文件md5(尽量别重名，否则会给你发错哦！http-sdk会先检测文件在不在，如果不在才去url下载，再发送，否则直接发送)
    }
  }
 */
export const BotEventSchema = z.object({
  event: z.string(),
  robot_wxid: z.string(),
  robot_name: z.string(),
  type: z.number(),
  from_wxid: z.string(),
  from_name: z.string(),
  final_from_wxid: z.string(),
  final_from_name: z.string(),
  to_wxid: z.string(),
  msg: z.any(),
  money: z.number().optional(),
})

export type BotEvent = z.output<typeof BotEventSchema>

export type BotRooms = Room[]

export abstract class BotPlugin {
  order = 0
  name: string = 'BotPlugin'

  constructor() {}

  handler(event: BotEvent, groupRooms: RoomReal[]): void {}
}

type BotActionData<T = string> = {
  botWxid?: string
  toWxid?: string
  payload: {
    // 参数 is_refresh, 逻辑型, 可空 , 为真将重新加载列表（注意切记不要频繁加载这里），不然将取缓存，默认为假
    is_refresh?: boolean
    group_wxid?: string

    event: string
    msg?: T
  }
}

export class Bot {
  async GetGroupMemberList(botWxid: string, wxid: string, nocache = false) {
    return this.call({
      botWxid,
      payload: {
        event: 'GetGroupMemberList',
        group_wxid: wxid,
        msg: {
          is_refresh: nocache,
        },
      },
    })
  }

  async GetGroupList(botWxid: string, nocache = false) {
    return this.call({
      botWxid,
      payload: {
        event: 'GetGroupList',
        msg: {
          is_refresh: nocache,
        },
      },
    })
  }

  async GetLoggedAccountList() {
    return this.call({
      payload: {
        event: 'GetLoggedAccountList',
        msg: {
          is_refresh: true,
        },
      },
    })
  }

  async batchTask(fns: Function[], time = 2000) {
    fns.forEach((fn) => {
      setTimeout(() => {
        fn()
      }, time)
    })
  }

  async call<T = any>(data: BotActionData<T>) {
    var myHeaders = new Headers()
    myHeaders.append('User-Agent', 'Apifox/1.0.0 (https://apifox.com)')
    myHeaders.append('Content-Type', 'application/json')

    const body = {
      success: true, //true时，http-sdk才处理，false直接丢弃
      message: 'successful!',
      robot_wxid: data.botWxid || '', //用哪个机器人发
      to_wxid: data.toWxid || '', //发到哪里？群/好友
      member_wxid: '',
      member_name: '',
      group_wxid: '',
      ...data.payload,
      // 内容相关
      // event: 'SendImageMsg', //告诉它干什么，SendImageMsg是发送图片事件
      // msg: {
      //   //消息内容:发送 图片、视频、文件、动态表情都是这个结构
      //   url: 'https://b3logfile.com/bing/20201024.jpg',
      //   name: '20201024.jpg', //带有扩展名的文件名，建议文件md5(尽量别重名，否则会给你发错哦！http-sdk会先检测文件在不在，如果不在才去url下载，再发送，否则直接发送)
      // },
    }

    const initOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(body),
    }

    return fetch(`http://192.168.200.100:8090`, initOptions)
      .then(async (response) => await response.json())
      .catch((error) => {
        console.error('机器人异常', error)
        return Promise.reject(error)
      })
  }
}
