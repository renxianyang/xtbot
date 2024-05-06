<template>
  <div>
    <h1>本页面有缓存，清除经常不管用。</h1>

    <div class="text-[green] text-[10px]">
      <h1>采集模式，机器人不会在群里发言，非常安全。。。</h1>
      <h1>转发分组，多个以【英文逗号】分隔， 比如设置了 河南,河北，采集到就会转发到这两个分组。</h1>
      <h1>转发分组，只设置一个0，则会转发到所有群（总开关是开启的群）</h1>
    </div>

    <a-list class="mt-[20px]">
      <a-list-item v-for="item in state.list" :key="item.wxid">
        <a-list-item-meta>
          <template #avatar>
            <div>
              <img
                class="w-[80px] h-[80px] rounded m-[auto] mt-[5px]"
                alt="avatar"
                :src="item.headimgurl"
              />

              <div class="mt-[10px] text-center">
                <a-input v-model.number="item.order" class="w-[100px]" style="width: 100px" />
                <br />
                <a-button type="text" @click="onChangeOrder(item)">保存排序</a-button>
              </div>
            </div>
          </template>

          <template #title>
            <div class="flex items-center">
              <div>{{ item.nickname }}</div>
            </div>
            <div class="mt-[10px]">
              群ID：{{ item.wxid }}
              <div v-if="item.roomInfo" class="inline-block">
                <span class="text-[red] cursor-pointer ml-[20px]" @click="onUnindRoom(item)">
                  解绑
                </span>
              </div>
              <div v-else class="inline-block">
                <span class="text-[red] cursor-pointer ml-[20px]" @click="onBindRoom(item)">
                  绑定
                </span>
              </div>
            </div>
          </template>

          <template #description v-if="item.roomInfo">
            <div class="mt-[10px]">
              <div class="flex">
                <div>总开关：</div>
                <a-radio-group v-model="item.open" @change="onChangeOpen(item)">
                  <a-radio value="0">关闭</a-radio>
                  <a-radio value="1">开启</a-radio>
                </a-radio-group>

                <div>
                  <span class="text-[blue] cursor-pointer ml-[0px]" @click="onManageMember(item)">
                    成员管理
                  </span>
                </div>
              </div>
              <div class="flex mt-[10px]">
                <div class="flex-shrink-0">群插件开关：</div>
                <a-checkbox-group v-model="item.openPlugins" @change="onChangeOpenPlugin(item)">
                  <a-checkbox v-for="item in state.plugins" :key="item" :value="item">
                    {{ item }}
                  </a-checkbox>
                </a-checkbox-group>
              </div>
              <div class="mt-[10px]">
                <div class="flex items-center">
                  <div>
                    <span class="mr-[8px]">采集模式:</span>
                    <a-switch
                      v-model="item.onlyListen"
                      checked-value="1"
                      unchecked-value="0"
                      @change="onChangeOnlyListen(item)"
                    />
                  </div>

                  <div class="flex items-center ml-[20px]">
                    <div class="flex-shrink-0">转发分组：</div>
                    <a-input v-model="item.transferGroups" />
                    <a-button
                      type="primary"
                      class="ml-[20px]"
                      @click="onChangetransferGroups(item)"
                    >
                      保存
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>

    <div class="mt-[20px]">
      <a-button type="primary" size="large" @click="loadList(true)">强制刷新列表</a-button>
      <span class="text-[red]">
        （谨慎使用！修改群昵称后、加入新群聊后、退出群聊后使用。实在不行就退出微信重新登录！）
      </span>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { appState } from '@/state'

const router = useRouter()

const state = reactive({
  list: [],
  plugins: [],
})

const loadList = (nocache = false) => {
  $g.api
    .get('room/list', {
      botWxid: appState.botInfo.wxid,
      nocache: nocache ? '1' : '0',
    })
    .then((res) => {
      const dbRooms = res.dbRooms.reduce((rst, item) => {
        rst[item.wxid] = item
        return rst
      }, {})

      res.rooms.forEach((item) => {
        const dbRoom = dbRooms[item.wxid]
        item.open = dbRoom ? dbRoom.open : '0'
        item.openPlugins = dbRoom ? JSON.parse(dbRoom.openPlugins) : []
        item.transferGroups = dbRoom ? dbRoom.transferGroups : []
        item.order = dbRoom ? dbRoom.order : 0
        item.onlyListen = dbRoom ? dbRoom.onlyListen : '0'
        item.roomInfo = dbRoom
      })

      res.rooms.sort((a, b) => b.order - a.order)

      console.log(res.rooms)

      state.list = res.rooms
      state.plugins = res.plugins
    })
}

loadList()

const onChangeOpen = (item) => {
  $g.api
    .post('room/open', {
      botWxid: appState.botInfo.wxid,
      wxid: item.wxid,
      open: item.open,
    })
    .then((res) => {
      alert('成功')
    })
    .catch(() => {})
}

const onChangeOpenPlugin = (item) => {
  $g.api
    .post('room/update', {
      botWxid: appState.botInfo.wxid,
      wxid: item.wxid,
      openPlugins: item.openPlugins,
    })
    .then((res) => {
      alert('成功')
    })
    .catch(() => {})
}

const onChangeOnlyListen = (item) => {
  $g.api
    .post('room/update', {
      botWxid: appState.botInfo.wxid,
      wxid: item.wxid,
      onlyListen: item.onlyListen,
    })
    .then((res) => {
      alert('成功')
    })
    .catch(() => {})
}

const onChangetransferGroups = (item) => {
  $g.api
    .post('room/update', {
      botWxid: appState.botInfo.wxid,
      wxid: item.wxid,
      transferGroups: item.transferGroups,
    })
    .then((res) => {
      alert('成功')
    })
    .catch(() => {})
}

const onChangeOrder = (item) => {
  $g.api
    .post('room/update', {
      botWxid: appState.botInfo.wxid,
      wxid: item.wxid,
      order: item.order,
    })
    .then((res) => {
      alert('成功')
      loadList()
    })
    .catch(() => {})
}

const onBindRoom = (item) => {
  $g.api
    .post('room/bind', {
      botWxid: appState.botInfo.wxid,
      wxid: item.wxid,
    })
    .then((res) => {
      loadList()
      alert('成功')
    })
    .catch(() => {})
}

const onUnindRoom = (item) => {
  $g.api
    .post('room/unbind', {
      id: item.roomInfo.id,
    })
    .then((res) => {
      loadList()
      alert('成功')
    })
    .catch(() => {})
}

const onManageMember = (item) => {
  window.open(
    router.resolve(`/room-member/${item.wxid}/${item.nickname}`).fullPath,
    'member',
    'width=1400,height=750,top=50,left=100',
  )
  // router.push('/room-member/' + btoa(encodeURIComponent(JSON.stringify(item.roomInfo))))
}
</script>
