<template>
  <div>
    <div class="login-form w-[400px] shadow-2xl p-5 rounded-lg">
      <h1>一个没起名的机器人</h1>
      <div class="text-[20px]">请输入卡密</div>
      <div class="mt-5">
        <a-textarea allow-clear class="h-[100px]" placeholder="点击“确定”按钮即可" />
      </div>
      <div class="mt-5 text-center">
        <a-button type="primary" size="large" class="w-[100px]" @click="onLogin">确定</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const onLogin = () => {
  localStorage.setItem('token', 'test token dev')

  router.replace('/')
}
</script>

<style lang="scss">
.login-form {
  position: fixed;
  top: 300px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
