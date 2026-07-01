<template>
  <div>
    <div style="margin-bottom:12px;display:flex;gap:12px;flex-wrap:wrap">
      <el-button type="primary" @click="openDialog()">添加资产</el-button>
      <el-button type="warning" @click="showSummary">汇总</el-button>
      <el-button @click="exportCSV">导出CSV</el-button>
      <el-input v-model="keyword" placeholder="搜索资产名称" style="width:200px" clearable @input="page = 1" />
    </div>
    <div style="min-height:400px">
    <el-table :data="paged" border stripe v-loading="loading" style="width:100%">
      <el-table-column prop="assetid" label="编号" width="55" />
      <el-table-column prop="assetname" label="名称" min-width="100" />
      <el-table-column prop="brand" label="品牌" min-width="40" />
      <el-table-column prop="department" label="部门" min-width="100" />
      <el-table-column prop="model" label="型号" min-width="80" />
      <el-table-column prop="quantity" label="数量" width="80" />
      <el-table-column prop="unitprice" label="单价" width="80" />
      <el-table-column prop="totalprice" label="总价" min-width="80" />
      <el-table-column prop="entrydate" label="入账日期" width="120" />
      <el-table-column prop="reportingdate" label="报废日期" width="120" />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div style="margin-top:12px;display:flex;justify-content:flex-end">
      <el-pagination
        v-model:current-page="page"
        :page-size="pageSize"
        :total="filtered.length"
        layout="total, prev, pager, next"
        background
      />
    </div>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑资产' : '添加资产'" width="600px">
      <el-form :model="form" label-width="80px">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="名称"><el-input v-model="form.assetname" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌"><el-input v-model="form.brand" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门">
              <el-select v-model="form.department" style="width:100%" filterable clearable placeholder="选择部门">
                <el-option v-for="d in depts" :key="d.id" :label="d.dept_name" :value="d.dept_name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号"><el-input v-model="form.model" /></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数量"><el-input v-model="form.quantity" /></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价"><el-input v-model="form.unitprice" /></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总价"><el-input v-model="form.totalprice" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计量单位"><el-input v-model="form.measurementunit" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人"><el-input v-model="form.responsibleperson" disabled /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入账日期">
              <el-date-picker v-model="form.entrydate" type="date" placeholder="选择日期" style="width:100%" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报废日期">
              <el-date-picker v-model="form.reportingdate" type="date" placeholder="选择日期" style="width:100%" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { api } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const userStore = useUserStore()
const list = ref([])
const depts = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const keyword = ref('')
const form = reactive({ assetid: '', assetname: '', brand: '', department: '', model: '', quantity: '', unitprice: '', totalprice: '', measurementunit: '', responsibleperson: userStore.username, entrydate: '', reportingdate: '' })

const page = ref(1)
const pageSize = ref(15)

const filtered = computed(() => {
  if (!keyword.value) return list.value
  return list.value.filter(i => i.assetname?.includes(keyword.value))
})

const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

async function loadDepts() {
  const res = await api('get_departments', { status: 1 })
  if (res.success) depts.value = res.data || []
}

function exportCSV() {
  const heads = ['编号','名称','品牌','部门','型号','数量','单价','总价','计量单位','负责人','入账日期','报废日期']
  const keys = ['assetid','assetname','brand','department','model','quantity','unitprice','totalprice','measurementunit','responsibleperson','entrydate','reportingdate']
  const rows = list.value.map(i => keys.map(k => '"' + (i[k] ?? '') + '"').join(','))
  const csv = '﻿' + heads.join(',') + '\n' + rows.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = '个人资产.csv'
  a.click()
}

function showSummary() {
  const totalQty = list.value.reduce((s, i) => s + Number(i.quantity || 0), 0)
  const totalPrice = list.value.reduce((s, i) => s + Number(i.quantity || 0) * Number(i.totalprice || 0), 0)
  ElMessageBox.alert(
    `总数量: ${totalQty} 件<br>总价值: ¥${totalPrice.toFixed(2)}`,
    '资产汇总信息',
    { confirmButtonText: '确定', dangerouslyUseHTMLString: true }
  )
}

function resetForm() {
  Object.keys(form).forEach(k => form[k] = '')
  form.responsibleperson = userStore.username
}

async function openDialog(row) {
  await loadDepts()
  if (row?.assetid) {
    isEdit.value = true
    Object.assign(form, row)
  } else {
    isEdit.value = false
    resetForm()
  }
  dialogVisible.value = true
}

async function handleSave() {
  saving.value = true
  const act = isEdit.value ? 'edit_assets' : 'add_assets'
  const res = await api(act, { ...form, assetid: form.assetid || '' })
  saving.value = false
  if (res.success) {
    ElMessage.success(res.message)
    dialogVisible.value = false
    fetchList()
  } else {
    ElMessage.error(res.message)
  }
}

async function handleDelete(row) {
  await ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' })
  const res = await api('del_assets', { id: row.assetid, username: userStore.username })
  if (res.success) {
    ElMessage.success('删除成功')
    fetchList()
  } else {
    ElMessage.error(res.message)
  }
}

async function fetchList() {
  loading.value = true
  const res = await api('get_user_assetsList', { username: userStore.username })
  list.value = (res.data || []).reverse()
  loading.value = false
}

onMounted(() => {  fetchList()
  loadDepts()
})
</script>
