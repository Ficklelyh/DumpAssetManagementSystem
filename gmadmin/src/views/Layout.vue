<template>
  <div style="height:100%">
    <!-- 移动端遮罩 -->
    <div v-if="mobileOpen" class="mobile-mask" @click="closeMobile" />

    <el-container style="height:100%">
      <!-- 侧边栏 -->
      <el-aside :width="sidebarWidth" class="sidebar" :class="{ 'mobile-side': isMobile, 'mobile-show': mobileOpen }">
        <div class="logo">{{ isCollapse && !isMobile ? '资产' : '资产管理系统' }}</div>
        <el-menu
          :default-active="route.path"
          :collapse="isCollapse && !isMobile"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          @select="closeMobile"
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <template v-if="level === 1">
            <el-menu-item index="/user-asset"><el-icon><Document /></el-icon><span>个人资产</span></el-menu-item>
            <el-menu-item index="/change-pwd"><el-icon><Key /></el-icon><span>修改密码</span></el-menu-item>
          </template>
          <template v-if="level === 2">
            <el-menu-item index="/school-asset"><el-icon><DataAnalysis /></el-icon><span>全校资产</span></el-menu-item>
            <el-menu-item index="/department-manage"><el-icon><Setting /></el-icon><span>部门管理</span></el-menu-item>
            <el-menu-item index="/user-add"><el-icon><UserFilled /></el-icon><span>添加用户</span></el-menu-item>
            <el-menu-item index="/change-pwd"><el-icon><Key /></el-icon><span>修改密码</span></el-menu-item>
          </template>
          <template v-if="level === 3">
            <el-menu-item index="/dept-asset"><el-icon><Files /></el-icon><span>本部门资产</span></el-menu-item>
            <el-menu-item index="/change-pwd"><el-icon><Key /></el-icon><span>修改密码</span></el-menu-item>
          </template>
          <template v-if="level === 4">
            <el-menu-item index="/school-asset"><el-icon><DataAnalysis /></el-icon><span>全校资产</span></el-menu-item>
            <el-menu-item index="/change-pwd"><el-icon><Key /></el-icon><span>修改密码</span></el-menu-item>
          </template>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="topbar">
          <el-icon class="collapse-btn" :size="20" @click="toggleSidebar">
            <Fold v-if="isMobile ? !mobileOpen : !isCollapse" />
            <Expand v-else />
          </el-icon>
          <span style="flex:1" />
          <span class="user-name">{{ userStore.username }}</span>
          <el-button text @click="handleLogout">退出</el-button>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { HomeFilled, Document, Key, DataAnalysis, Setting, UserFilled, Files, Fold, Expand } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const level = userStore.level
const isCollapse = ref(false)
const isMobile = ref(false)
const mobileOpen = ref(false)

const sidebarWidth = computed(() => {
  if (isMobile.value) return '220px'
  return isCollapse.value ? '64px' : '220px'
})

function checkMobile() {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) mobileOpen.value = false
}

function toggleSidebar() {
  if (isMobile.value) {
    mobileOpen.value = !mobileOpen.value
  } else {
    isCollapse.value = !isCollapse.value
  }
}

function closeMobile() {
  mobileOpen.value = false
}

function handleLogout() {
  userStore.logout()
  router.push('/login')
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.sidebar { background: #304156; overflow-y: auto; transition: width 0.3s; }
.logo { height: 60px; line-height: 60px; text-align: center; color: #fff; font-size: 16px; font-weight: bold; background: #2b3a4a; overflow: hidden; white-space: nowrap; }
.topbar { height: 50px; display: flex; align-items: center; border-bottom: 1px solid #e6e6e6; background: #fff; padding: 0 16px; }
.collapse-btn { cursor: pointer; flex-shrink: 0; }
.collapse-btn:hover { color: #409EFF; }
.el-menu { border-right: none; }
.user-name { margin-right: 12px; color: #666; }

/* 移动端 */
.mobile-side {
  position: fixed !important;
  left: -220px;
  top: 0;
  bottom: 0;
  z-index: 2001;
  transition: left 0.3s;
}
.mobile-side.mobile-show { left: 0; }
.mobile-mask {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,.45); z-index: 2000;
}

@media screen and (max-width: 768px) {
  .user-name { display: none; }
  .topbar { padding: 0 8px; }
}
</style>
