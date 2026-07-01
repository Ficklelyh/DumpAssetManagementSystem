<template>
  <div>
    <el-card style="max-width:500px" shadow="never">
      <template #header>修改密码</template>
      <el-form :model="form">
        <el-form-item label="用户名">
          <el-input :model-value="userStore.username" disabled />
        </el-form-item>
        <el-form-item label="旧密码"><el-input v-model="form.oldpassword" type="password" show-password /></el-form-item>
        <el-form-item label="新密码"><el-input v-model="form.newpassword" type="password" show-password /></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleChange" :loading="saving">修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { api } from '@/api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const form = reactive({ oldpassword: '', newpassword: '' })
const saving = ref(false)

async function handleChange() {
  if (!form.oldpassword || !form.newpassword) { ElMessage.warning('请填写完整'); return }
  saving.value = true
  const res = await api('changepwd', { username: userStore.username, ...form })
  saving.value = false
  if (res.success) {
    ElMessage.success('密码修改成功，请重新登录')
    userStore.logout()
    router.push('/login')
  } else {
    ElMessage.error(res.message)
  }
}
</script>
