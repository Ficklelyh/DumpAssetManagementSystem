# 资产管理系统

> Core · 资产管理系统  
> Go (Gin) + MySQL + Vue 3 (Element Plus) 全栈重构

---

## 技术栈

| 层 | 技术 |
|---|------|
| 后端 | Go 1.26 + [Gin](https://github.com/gin-gonic/gin) + `database/sql` + MySQL |
| 前端 | Vue 3.4 + Vite 5 + Element Plus 2.7 + Pinia + Vue Router 4 |
| 数据库 | MySQL 5.7+ |

---

## 项目结构

```
ZeroGin/
├── backGin/                    # Go 后端
│   ├── main.go                 # 入口 + 路由
│   ├── config/config.go        # 环境变量配置
│   ├── model/                  # 数据模型
│   │   ├── user.go             # User / LoginRequest / RegisterRequest
│   │   ├── asset.go            # Asset / AssetRequest
│   │   ├── department.go       # Department / DepartmentRequest
│   │   ├── response.go         # 通用 JSON 响应
│   │   └── flexnum.go          # FlexInt / FlexFloat（兼容字符串数字）
│   ├── handler/                # HTTP 处理层
│   │   ├── api.go              # 统一入口（act 分发）
│   │   ├── auth.go             # 登录 / 注册 / 改密
│   │   ├── asset.go            # 资产 CRUD
│   │   ├── department.go       # 部门管理
│   │   ├── sso.go              # SSO 验证
│   │   └── stats.go            # 统计
│   ├── service/                # 业务逻辑层
│   ├── middleware/              # 中间件
│   │   ├── cors.go             # CORS
│   │   └── ratelimit.go        # 限流
│   └── pkg/database/mysql.go   # 数据库连接
│
└── frontGin/../dist/gmadmin/   # Vue 3 前端
    ├── package.json
    ├── vite.config.js           # Vite 配置 + API 代理
    ├── index.html
    └── src/
        ├── App.vue
        ├── main.js
        ├── style.css
        ├── api/index.js         # 统一 API 请求
        ├── router/index.js      # 路由 + 登录守卫
        ├── stores/user.js       # Pinia 用户状态
        └── views/
            ├── Login.vue        # 登录页
            ├── Layout.vue       # 后台布局（侧栏 + 顶栏 + 标签）
            ├── Home.vue         # 首页统计卡片
            ├── UserAsset.vue    # 个人资产管理（CRUD）
            ├── SchoolAsset.vue  # 全校资产查询
            ├── DeptAsset.vue    # 部门资产查询
            ├── DepartmentManage.vue  # 部门管理（CRUD）
            ├── UserAdd.vue      # 添加用户
            └── ChangePwd.vue    # 修改密码
```

---

## 快速启动

### 1. 数据库

创建 MySQL 数据库（默认 `sjzeisassetsys`），导入表结构：

```sql
-- user 表
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(64) NOT NULL,
  level INT NOT NULL DEFAULT 1,
  regtime DATETIME DEFAULT NOW()
);

-- departments 表
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(100) NOT NULL,
  dept_code VARCHAR(50),
  dept_desc VARCHAR(255),
  sort_order INT DEFAULT 0,
  status INT DEFAULT 1
);

-- asset 表
CREATE TABLE asset (
  assetid INT AUTO_INCREMENT PRIMARY KEY,
  assetname VARCHAR(200) NOT NULL,
  brand VARCHAR(100),
  department VARCHAR(100),
  entrydate DATE,
  measurementunit VARCHAR(50),
  model VARCHAR(100),
  quantity INT,
  reportingdate DATE,
  totalprice DECIMAL(12,2),
  responsibleperson VARCHAR(50),
  unitprice DECIMAL(12,2)
);
```

### 2. 后端

```bash
cd backGin
# 启动
go run main.go
```

### 3. 前端

```bash
cd frontGin/../dist/gmadmin
npm install
npm run dev       # 开发 :3000，自动代理到 :8080
npm run build     # 生产构建
```

---

## API 说明

### 统一入口

所有接口 `POST`，请求体含 `act` 字段区分操作：

```
POST /api
Content-Type: application/json

{ "act": "动作名", ...参数 }
```

### 接口列表

| act | 说明 | 参数 |
|-----|------|------|
| `login` | 登录 | `username`, `password` |
| `register` | 注册 | `username`, `password`, `level` |
| `changepwd` | 修改密码 | `username`, `oldpassword`, `newpassword` |
| `sso` | SSO 验证 | `s1`(username), `s2`(level), `s3`(id) |
| `get_stats` | 统计面板 | 无 |
| | | |
| `get_assetsList` | 全校资产列表 | 无 |
| `get_user_assetsList` | 个人资产列表 | `username` |
| `get_departmentList` | 部门资产列表 | `dept` |
| `add_assets` | 添加资产 | `assetname`, `brand`, `department`, `model`, `quantity`, `unitprice`, `totalprice`, `measurementunit`, `responsibleperson`, `entrydate`, `reportingdate` |
| `edit_assets` | 编辑资产 | 同上 + `assetid` |
| `del_assets` | 删除资产 | `id` |
| `edit_assetsssss` | 查询资产归属 | `assetid`, `username` |
| | | |
| `get_departments` | 部门列表 | `status`(可选, 1=启用) |
| `add_department` | 添加部门 | `dept_name`, `dept_code`, `dept_desc`, `sort_order` |
| `edit_department` | 编辑部门 | 同上 + `id` |
| `del_department` | 删除部门 | `id` |
| `toggle_department` | 启用/禁用部门 | `id`, `status` |

### 响应格式

```json
{ "code": 0, "success": true, "message": "操作成功", "data": {...} }
```

---

## 用户权限

| Level | 角色 | 权限 |
|-------|------|------|
| 1 | 普通资产管理员 | 管理个人资产、修改密码 |
| 2 | 总务 | 全校资产、部门管理、添加用户、修改密码 |
| 3 | 专业部管理员 | 本部门资产、修改密码 |
| 4 | 主管/校长 | 查看全校资产、修改密码 |

---

## 前端页面

| 路由 | 页面 | 说明 |
|------|------|------|
| `/login` | 登录 | 深蓝渐变背景 |
| `/` | 首页 | 统计卡片（用户数/资产数/部门数） |
| `/user-asset` | 个人资产 | 增删改查 + 搜索 + 分页 + CSV 导出 + 汇总 |
| `/school-asset` | 全校资产 | 查看 + 搜索 + 分页 + CSV 导出 |
| `/dept-asset` | 部门资产 | 按部门筛选 + 搜索 + 分页 + CSV 导出 |
| `/department-manage` | 部门管理 | 增删改 + 启用/禁用 |
| `/user-add` | 添加用户 | 注册新用户 |
| `/change-pwd` | 修改密码 | 改完自动退出重新登录 |

---

## 特性

- **空日期处理** — `""` 自动转 SQL NULL
- **手机端自适应** — 侧栏滑入、表格横向滚动、弹窗全宽
- **CSV 导出** — BOM 头，Excel 打开无乱码
