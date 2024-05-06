<template>
  <div>
    <a-checkbox-group v-model="state.listenMembers">
      <div>
        <h1>群昵称：{{ roomInfo.nickname }}，群ID：{{ roomInfo.wxid }}</h1>
      </div>

      <div class="flex justify-between">
        <div class="text-[16px] flex items-center">
          监听所有人（除了机器人自己），自动忽略下面的配置：
          <a-checkbox value="-1" style="zoom: 1.5"></a-checkbox>
        </div>

        <div class="right">
          <a-button type="primary" @click="onChangeListenMembers">保存</a-button>
        </div>
      </div>
      <a-list class="mt-[10px]">
        <a-list-item v-for="item in state.list" :key="item.wxid">
          <a-list-item-meta>
            <template #avatar>
              <div>
                <img class="w-[50px] h-[50px] rounded" alt="avatar" :src="item.headimgurl" />
              </div>
            </template>

            <template #title>
              <div class="flex">
                <div class="text-[blue]">用户昵称：{{ item.nickname }}</div>
                <div class="ml-[20px]">微信ID：{{ item.wxid }}</div>
              </div>
            </template>

            <template #description>
              <div class="mt-[10px]">
                <div class="flex">
                  <div>监听：</div>
                  <a-checkbox :value="item.wxid"></a-checkbox>
                </div>
              </div>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </a-checkbox-group>

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

const route = useRoute()

// const roomInfo = JSON.parse(decodeURIComponent(atob(route.params.roomInfo)))

const roomInfo = {
  wxid: route.params.wxid,
  nickname: route.params.nickname,
}

const state = reactive({
  list: [],
  listenMembers: [],
  room: null,
})

const loadList = (nocache = false) => {
  $g.api
    .get('room/member/list', {
      botWxid: appState.botInfo.wxid,
      wxid: roomInfo.wxid,
      nocache: nocache ? '1' : '0',
    })
    .then((res) => {
      state.list = res.rooms
      state.room = res.room
      state.listenMembers = JSON.parse(state.room.listenMembers)
    })
}

loadList()

const onChangeListenMembers = () => {
  $g.api
    .post('room/update', {
      botWxid: appState.botInfo.wxid,
      wxid: state.room.wxid,
      listenMembers: state.listenMembers,
    })
    .then((res) => {
      alert('成功')
    })
    .catch(() => {})
}
</script>
