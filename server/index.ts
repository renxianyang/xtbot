import yargs from 'yargs'
import Koa from 'koa'
import Router from 'koa-router'
import fs from 'fs'
import koaBody from 'koa-bodyparser'
import koaCors from 'koa2-cors'

/**
 * global helper #start
 */
import './context'
import { encryptPlugin } from './plugins/encrypt'
/**
 * global helper #end
 */

const bootArgv = yargs(process.argv).parse() as unknown as { mode: string }
const isDev = bootArgv.mode === 'dev'
const port = isDev ? 3333 : 5555

$g.isDev = isDev
$g.port = port

const app = new Koa()
app.use(koaCors())
app.use(koaBody())
app.use(require('koa-static')('public'))
if (!isDev) {
  app.use(require('koa-static')('public/web'))
}

encryptPlugin(app)

/**
 * auto register router #start
 */
const routerPrefix = '/api/'
const routers = fs.readdirSync('./router').map((item) => item.replace('.ts', ''))
routers.forEach((item) => {
  if (item[0] === '.') return
  const router: Router = require('./router/' + item).router
  router.prefix(routerPrefix + item)
  app.use(router.routes())
})
/**
 * auto register router #end
 */

/**
 * auto register bot plugins #start
 */
const botPlugins = fs.readdirSync('./bot/plugins').map((item) => item.replace('.ts', ''))
botPlugins.forEach((item) => {
  if (item[0] === '.') return
  const Plugin: any = require('./bot/plugins/' + item).default
  $g.botPlugins.push(new Plugin())
})
// 排序
$g.botPlugins.sort((a, b) => a.order - b.order)
/**
 * auto register bot plugins #start
 */

app.listen(port, async () => {
  console.log(`服务已启动：http://127.0.0.1:${port}`)
})
