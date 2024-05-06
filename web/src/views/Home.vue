<template>
  <div>
    <h1>本页面有缓存，暂时没有清除的接口。</h1>
    <a-list>
      <a-list-item v-for="item in state.bots" :key="item.wxid">
        <a-list-item-meta>
          <template #avatar>
            <img
              class="w-[100px] h-[100px] rounded"
              alt="avatar"
              :src="
                item.headimgurl ||
                'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'
              "
            />
          </template>

          <template #title>
            <div>{{ item.nickname }}</div>
            <div class="mt-[10px]">微信ID：{{ item.wxid }}</div>
          </template>

          <template #description>
            <div class="mt-[10px]">
              <div v-if="!appState.botInfo || item.wxid !== appState.botInfo.wxid">
                <a-button type="primary" @click="onChangeBot(item)">管理此机器人</a-button>
              </div>
              <div v-else>使用中</div>
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
    <!-- <div class="mt-[20px]">
      <a-button type="primary" size="large" @click="loadList(true)">强制刷新列表</a-button>
      <span class="text-[red]">
        （谨慎使用！修改群昵称后、加入新群聊后、退出群聊后使用。实在不行就退出微信重新登录！）
      </span>
    </div> -->
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { appState } from '@/state'

const state = reactive({
  bots: [],
})

const loadList = (nocache = false) => {
  $g.api
    .get('bot/bots', {
      nocache: nocache ? '1' : '0',
    })
    .then((res) => {
      console.log(res)
      state.bots = res.data
    })
}

loadList()

const onChangeBot = (item) => {
  appState.botInfo = item
  localStorage.setItem('botInfo', JSON.stringify(item))

  alert('成功')
}
</script>
