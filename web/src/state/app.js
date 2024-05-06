import { reactive } from 'vue'

export const appState = reactive({
  botInfo: localStorage.getItem('botInfo') ? JSON.parse(localStorage.getItem('botInfo')) : null,
})
