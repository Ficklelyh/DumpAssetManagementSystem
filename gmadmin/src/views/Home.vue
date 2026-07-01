<template>
  <div>
    <h3 style="margin-bottom:16px">您好, {{ userStore.username }}</h3>
    <el-row :gutter="16">
      <el-col :xs="12" :sm="12" :md="6" v-for="s in stats" :key="s.label" style="margin-bottom:16px">
        <div class="stat-card" :style="{ borderLeftColor: s.color }">
          <div class="stat-body">
            <div class="stat-value" :style="{ color: s.color }">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>

        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { api } from '@/api'
import { User, Box, Money, OfficeBuilding } from '@element-plus/icons-vue'

const userStore = useUserStore()
const stats = ref([
  { label: '用户数', value: 0, color: '#409EFF', icon: User },
  { label: '资产数', value: 0, color: '#67C23A', icon: Box },
  { label: '部门数', value: 0, color: '#F56C6C', icon: OfficeBuilding }
])

onMounted(async () => {
  const res = await api('get_stats')
  if (res.success) {
    stats.value[0].value = res.data.user_count
    stats.value[1].value = res.data.asset_count

    stats.value[2].value = res.data.dept_count
  }
})
</script>

<style scoped>
.stat-card {
  display: flex; align-items: center; justify-content: space-between;
  background: #fff; border-radius: 6px; padding: 20px 16px;
  border:1px solid #ebebeb;

}

.stat-value { font-size: 28px; font-weight: bold; line-height: 1.2; }
.stat-label { font-size: 14px; color: #999; margin-top: 4px; }
.stat-icon {
  width: 52px; height: 52px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
</style>
