<template>
  <div class="login-wrap">
    <div class="login-box">
      <div class="login-header">
        <div class="login-logo">资产管理系统</div>
        <p>CORE</p>
      </div>
      <el-form :model="form" class="login-form" @keyup.enter="handleLogin">
        <el-form-item>
          <el-input v-model="form.username" placeholder="用户名" :prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="密码" show-password :prefix-icon="Lock" size="large" @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" size="large" style="width:100%" @click="handleLogin">登 录</el-button>
        </el-form-item>
      </el-form>
      <div class="login-footer">v5.2026</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const form = reactive({ username: '', password: '' })

async function handleLogin() {
  if (!form.username || !form.password) { ElMessage.warning('请输入用户名和密码'); return }
  loading.value = true
  const res = await userStore.login(form.username, form.password)
  loading.value = false
  if (res.success) { router.push('/') }
  else { ElMessage.error(res.message || '登录失败') }
}
</script>

<style>
/* 登录页背景 - 覆盖全屏 */
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  overflow: hidden;
}
/* 装饰圆 */
.login-wrap::before,
.login-wrap::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,.06);
}
.login-wrap::before {
  width: 400px; height: 400px;
  top: -120px; right: -80px;
}
.login-wrap::after {
  width: 300px; height: 300px;
  bottom: -100px; left: -60px;
}
/* 登录卡片 */
.login-box {
  width: 380px;
  background: #fff;
  border-radius: 10px;
  padding: 40px 36px 24px;

  position: relative;
  z-index: 1;
}
/* 头部 */
.login-header {
  text-align: center;
  margin-bottom: 28px;
}
.login-logo {
  font-size: 24px;
  font-weight: bold;
  color: #2a5298;
  letter-spacing: 2px;
}
.login-header p {
  font-size: 13px;
  color: #999;
  margin-top: 8px;
}
/* 输入框 */
.login-form .el-input__wrapper {
  background: #f5f6fa;
  border: none;
  border-radius: 6px;
  padding: 4px 12px;
}
.login-form .el-input__wrapper:hover,
.login-form .el-input__wrapper.is-focus {
  background: #eef0f6;
  box-shadow: 0 0 0 1px #2a5298 inset;
}
/* 按钮 */
.login-form .el-button--primary {

  border: none;
  border-radius: 6px;
  font-size: 16px;
  letter-spacing: 4px;
}
.login-form .el-button--primary:hover {
  opacity: .9;
}
/* 底部 */
.login-footer {
  text-align: center;
  color: #ccc;
  font-size: 12px;
  margin-top: 12px;
}
</style>
