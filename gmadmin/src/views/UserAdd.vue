<template>
  <div>
    <el-card style="max-width:500px" shadow="never">
      <template #header>添加用户</template>
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名"><el-input v-model="form.username" /></el-form-item>
        <el-form-item label="密码"><el-input v-model="form.password" type="password" show-password /></el-form-item>
        <el-form-item label="权限">
          <el-select v-model="form.level" style="width:100%">
            <el-option :value="1" label="普通资产管理员" />
            <el-option :value="2" label="总务" />
            <el-option :value="3" label="专业部管理员" />
            <el-option :value="4" label="主管/校长" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd" :loading="saving">添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { api } from '@/api'
import { ElMessage } from 'element-plus'

const form = reactive({ username: '', password: '', level: 1 })
const saving = ref(false)

async function handleAdd() {
  if (!form.username || !form.password) { ElMessage.warning('请填写完整'); return }
  saving.value = true
  const res = await api('register', { ...form })
  saving.value = false
  if (res.success) { ElMessage.success(res.message); form.username = ''; form.password = '' }
  else { ElMessage.error(res.message) }
}
</script>
