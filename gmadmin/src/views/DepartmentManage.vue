<template>
  <div>
    <div style="margin-bottom:12px">
      <el-button type="primary" @click="openDialog()">添加部门</el-button>
    </div>
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="dept_name" label="名称" width="150" />
      <el-table-column prop="dept_code" label="编码" width="100" />
      <el-table-column prop="dept_desc" label="描述" width="200" />
      <el-table-column prop="sort_order" label="排序" width="60" />
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" :type="row.status === 1 ? 'warning' : 'success'" @click="handleToggle(row)">
            {{ row.status === 1 ? '禁用' : '启用' }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑部门' : '添加部门'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.dept_name" /></el-form-item>
        <el-form-item label="编码"><el-input v-model="form.dept_code" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.dept_desc" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort_order" :min="0" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { api } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const list = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const form = reactive({ id: '', dept_name: '', dept_code: '', dept_desc: '', sort_order: 0, status: 1 })

function resetForm() { Object.assign(form, { id: '', dept_name: '', dept_code: '', dept_desc: '', sort_order: 0, status: 1 }) }

function openDialog(row) {
  if (row?.id) { isEdit.value = true; Object.assign(form, row) }
  else { isEdit.value = false; resetForm() }
  dialogVisible.value = true
}

async function handleSave() {
  saving.value = true
  const act = isEdit.value ? 'edit_department' : 'add_department'
  const res = await api(act, { ...form, id: form.id || 0 })
  saving.value = false
  if (res.success) { ElMessage.success(res.message); dialogVisible.value = false; fetchList() }
  else { ElMessage.error(res.message) }
}

async function handleToggle(row) {
  const res = await api('toggle_department', { id: row.id, status: row.status === 1 ? 0 : 1 })
  if (res.success) { ElMessage.success(res.message); fetchList() }
  else { ElMessage.error(res.message) }
}

async function handleDelete(row) {
  await ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' })
  const res = await api('del_department', { id: row.id })
  if (res.success) { ElMessage.success(res.message); fetchList() }
  else { ElMessage.error(res.message) }
}

async function fetchList() {
  loading.value = true
  const res = await api('get_departments')
  list.value = res.data || []
  loading.value = false
}

onMounted(fetchList)
</script>
