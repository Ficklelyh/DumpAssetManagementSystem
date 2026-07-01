import { defineStore } from 'pinia'
import { api } from '@/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: sessionStorage.getItem('username') || '',
    level: Number(sessionStorage.getItem('level')) || 0,
    userId: sessionStorage.getItem('userId') || ''
  }),
  actions: {
    async login(username, password) {
      const res = await api('login', { username, password })
      if (res.success) {
        this.username = res.data.username
        this.level = res.data.level
        this.userId = res.data.id
        sessionStorage.setItem('username', res.data.username)
        sessionStorage.setItem('level', res.data.level)
        sessionStorage.setItem('userId', res.data.id)
      }
      return res
    },
    logout() {
      this.username = ''
      this.level = 0
      this.userId = ''
      sessionStorage.clear()
    }
  }
})
