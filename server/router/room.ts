import Router from 'koa-router'
import { z } from 'zod'
import { nanoid } from 'nanoid'

export const router = new Router()

router.get('/list', async (ctx) => {
  const body = z
    .object({
      botWxid: z.string(),
      nocache: z.enum(['0', '1']),
    })
    .parse(ctx.request.query)

  const rooms = (await $g.bot.GetGroupList(body.botWxid, body.nocache === '1')).data
  const dbRooms = await $g.db
    .selectFrom('room')
    .selectAll()
    .where('botWxid', '=', body.botWxid)
    .execute()

  ctx.body = {
    rooms,
    dbRooms,
    plugins: $g.botPlugins.map((item) => item.name),
  }
})

router.get('/member/list', async (ctx) => {
  const body = z
    .object({
      botWxid: z.string(),
      wxid: z.string(),
      nocache: z.enum(['0', '1']),
    })
    .parse(ctx.request.query)

  const rooms = (await $g.bot.GetGroupMemberList(body.botWxid, body.wxid, body.nocache === '1'))
    .data

  const room = await $g.db
    .selectFrom('room')
    .selectAll()
    .where('botWxid', '=', body.botWxid)
    .where('wxid', '=', body.wxid)
    .executeTakeFirst()

  ctx.body = {
    rooms,
    room,
  }
})

router.post('/bind', async (ctx) => {
  const body = z
    .object({
      botWxid: z.string(),
      wxid: z.string(),
    })
    .parse(ctx.request.body)

  const existItem = await $g.db
    .selectFrom('room')
    .selectAll()
    .where('wxid', '=', body.wxid)
    .where('botWxid', '=', body.botWxid)
    .executeTakeFirst()

  if (existItem) {
    ctx.body = { error: '操作异常，小心封号！' }
    return
  }

  await $g.db
    .insertInto('room')
    .values({
      id: nanoid(),
      botWxid: body.botWxid,
      wxid: body.wxid,
      open: '0',
      openPlugins: JSON.stringify([]),
      transferGroups: '',
      order: 0,
      listenMembers: JSON.stringify([]),
      onlyListen: '0',
    })
    .execute()

  ctx.body = 'ok'
})

router.post('/unbind', async (ctx) => {
  const body = z
    .object({
      id: z.string(),
    })
    .parse(ctx.request.body)

  await $g.db.deleteFrom('room').where('id', '=', body.id).execute()

  ctx.body = 'ok'
})

router.post('/open', async (ctx) => {
  const body = z
    .object({
      botWxid: z.string(),
      wxid: z.string(),
      open: z.enum(['0', '1']),
    })
    .parse(ctx.request.body)

  await $g.db
    .updateTable('room')
    .set({
      open: body.open,
    })
    .where('wxid', '=', body.wxid)
    .where('botWxid', '=', body.botWxid)
    .execute()

  ctx.body = 'ok'
})

router.post('/update', async (ctx) => {
  const body = z
    .object({
      botWxid: z.string(),
      wxid: z.string(),
      openPlugins: z.array(z.string()).optional(),
      transferGroups: z.string().optional(),
      order: z.number().optional(),
      onlyListen: z.enum(['0', '1']).optional(),
      listenMembers: z.array(z.string()).optional(),
    })
    .parse(ctx.request.body)

  let builder = $g.db.updateTable('room')

  if (body.listenMembers) {
    builder = builder.set({
      listenMembers: JSON.stringify(body.listenMembers),
    })
  }

  if (body.openPlugins !== undefined) {
    builder = builder.set({
      openPlugins: JSON.stringify(body.openPlugins),
    })
  }

  if (body.transferGroups !== undefined) {
    builder = builder.set({
      transferGroups: body.transferGroups,
    })
  }

  if (body.order !== undefined) {
    builder = builder.set({
      order: body.order,
    })
  }

  if (body.onlyListen !== undefined) {
    builder = builder.set({
      onlyListen: body.onlyListen,
    })
  }

  await builder.where('wxid', '=', body.wxid).where('botWxid', '=', body.botWxid).execute()

  ctx.body = 'ok'
})
