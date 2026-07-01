<template>
  <div>
    <div style="margin-bottom:12px;display:flex;gap:12px;flex-wrap:wrap">
      <el-button @click="exportCSV">导出CSV</el-button>
      <el-input v-model="keyword" placeholder="搜索" style="width:200px" clearable @input="page = 1" />
    </div>
    <div style="min-height:400px">
    <el-table :data="paged" border stripe v-loading="loading" style="width:100%">
      <el-table-column prop="assetid" label="编号" width="55" />
      <el-table-column prop="assetname" label="名称" min-width="100" />
      <el-table-column prop="brand" label="品牌" min-width="80" />
      <el-table-column prop="department" label="部门" min-width="100" />
      <el-table-column prop="responsibleperson" label="负责人" min-width="80" />
      <el-table-column prop="model" label="型号" min-width="80" />
      <el-table-column prop="quantity" label="数量" width="55" />
      <el-table-column prop="unitprice" label="单价" min-width="80" />
      <el-table-column prop="totalprice" label="总价" min-width="80" />
      <el-table-column prop="entrydate" label="入账日期" width="100" />
      <el-table-column prop="reportingdate" label="报废日期" width="100" />
    </el-table>
    </div>
    <div style="margin-top:12px;display:flex;justify-content:flex-end">
      <el-pagination v-model:current-page="page" :page-size="pageSize" :total="filtered.length" layout="total, prev, pager, next" background />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'

const list = ref([])
const loading = ref(false)
const keyword = ref('')
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

function exportCSV() {
  const heads = ['编号','名称','品牌','部门','负责人','型号','数量','单价','总价','入账日期','报废日期']
  const keys = ['assetid','assetname','brand','department','responsibleperson','model','quantity','unitprice','totalprice','entrydate','reportingdate']
  const rows = list.value.map(i => keys.map(k => '"' + (i[k] ?? '') + '"').join(','))
  const csv = '﻿' + heads.join(',') + '\n' + rows.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = '全校资产.csv'
  a.click()
}

onMounted(async () => {
  loading.value = true
  const res = await api('get_assetsList')
  list.value = (res.data || []).reverse()
  loading.value = false
})
</script>
