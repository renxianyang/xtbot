<template>
  <a-config-provider>
    <div class="admin-layout shadow-lg">
      <div class="container-1200">
        <div class="flex">
          <div class="left mr-10">
            <div class="p-[20px]">
              <div class="text-[20px]">
                <div v-if="appState.botInfo" class="text-center">
                  <img
                    class="w-[100px] h-[100px] rounded inline-block"
                    alt="avatar"
                    :src="
                      appState.botInfo.headimgurl ||
                      'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'
                    "
                  />
                  <div class="mt-[20px]">{{ appState.botInfo.nickname }}</div>
                  <!-- <div class="mt-[20px]">{{ appState.botInfo.wxid }}</div> -->
                </div>
                <div v-else>
                  <a-button type="primary" status="warning" size="large" @click="">
                    请选择机器人
                  </a-button>
                </div>
              </div>
            </div>

            <a-menu :default-selected-keys="[$route.path]" auto-open @menu-item-click="onMenuClick">
              <a-menu-item key="/">
                <template #icon>
                  <icon-apps></icon-apps>
                </template>
                选择机器人
              </a-menu-item>
              <a-menu-item key="/room">
                <template #icon>
                  <icon-apps></icon-apps>
                </template>
                群列表
              </a-menu-item>
              <a-menu-item key="/doc">
                <template #icon>
                  <icon-apps></icon-apps>
                </template>
                文档说明
              </a-menu-item>
              <a-sub-menu key="插件列表">
                <template #icon>
                  <icon-apps></icon-apps>
                </template>
                <template #title>插件列表</template>
                <a-menu-item key="/plugins/PingPong">PingPong</a-menu-item>
                <a-menu-item key="">电商返利</a-menu-item>
              </a-sub-menu>
            </a-menu>

            <div class="p-[20px]">
              <a-button type="primary" size="large" @click="onLogout">退出登录</a-button>
            </div>
          </div>

          <div class="right flex-1">
            <div class="layout-card">
              <div class="p-[20px]">
                <router-view v-slot="{ Component }">
                  <!-- <transition> -->
                  <keep-alive>
                    <component
                      v-if="$route.meta.keepAlive === true"
                      :is="Component"
                      :key="$route.fullPath"
                    />
                  </keep-alive>
                  <!-- </transition> -->
                  <!-- <transition> -->
                  <component
                    v-if="$route.meta.keepAlive !== true"
                    :is="Component"
                    :key="$route.fullPath"
                  />
                  <!-- </transition> -->
                </router-view>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { IconApps } from '@arco-design/web-vue/es/icon'
import { reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { appState } from '@/state'

const route = useRoute()
const router = useRouter()

const state = reactive({})

const onMenuClick = (key: string) => {
  router.push(key)
}

const onLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.admin-layout {
  overflow: auto;
  width: 1200px;
  margin: 100px auto;
  min-height: 100%;
}

:deep(.arco-menu) {
  width: 220px;

  .arco-menu-item-inner,
  .arco-menu-title {
  }

  .arco-menu-has-icon {
    .arco-menu-icon {
      margin-right: 6px;
      font-size: 16px;
    }
  }
}
</style>
