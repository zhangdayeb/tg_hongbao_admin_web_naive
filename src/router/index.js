import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import Home from '@/pages/home/Home.vue'
import Console from '@/pages/dashboard/Console'
import setting from '@/config/setting'

Vue.use(Router)

/**
 * 完全基于新菜单的路由配置
 */
export const allowRouters = [
  {
    path: '/',
    redirect: '/dashboard/console' // 根路径重定向到控制台
  },
  {
    path: '/login',
    component: () => import('@/pages/login/Login'),
    meta: {
      title: '登录',
      newPage: true // 标记为新页面，不加入标签页管理
    }
  },

  // 异常页面
  {
    path: '/exception',
    component: Home,
    meta: {
      title: '异常页面'
    },
    children: [
      {
        path: '403',
        component: () => import('@/pages/exception/403'),
        meta: {
          title: '403'
        }
      },
      {
        path: '404',
        component: () => import('@/pages/exception/404'),
        meta: {
          title: '404'
        }
      },
      {
        path: '500',
        component: () => import('@/pages/exception/500'),
        meta: {
          title: '500'
        }
      }
    ]
  },

  // 1. 控制台模块
  {
    path: '/dashboard',
    component: Home,
    meta: {
      title: '控制台'
    },
    children: [
      {
        path: 'console',
        component: Console,
        meta: {
          title: '控制面板'
        }
      }
    ]
  },

  {
    path: '/systemset',
    component: Home,
    meta: {
      title: '系统设置'
    },
    children: [
      {
        path: 'menulist',
        component: () => import('@/pages/systemset/menulist'),
        meta: {
          title: '菜单列表'
        }
      },
      {
        path: 'role',
        component: () => import('@/pages/systemset/role'),
        meta: {
          title: '角色权限管理'
        }
      },
      {
        path: 'controllerlist',
        component: () => import('@/pages/systemset/controllerlist'),
        meta: {
          title: '控制器管理'
        }
      },
      {
        path: 'log',
        component: () => import('@/pages/systemset/Log'),
        meta: {
          title: '操作日志'
        }
      },
      {
        path: 'roleadminlist',
        component: () => import('@/pages/systemset/roleadminlist'),
        meta: {
          title: '角色列表'
        }
      },
      {
        path: 'adminlist',
        component: () => import('@/pages/systemset/adminList'),
        meta: {
          title: '管理员列表'
        }
      },
    ]
  },
  // 2. 用户管理模块
  {
    path: '/user',
    component: Home,
    meta: {
      title: '用户管理'
    },
    children: [
      {
        path: 'userlist',
        component: () => import('@/pages/user/UserLists'),
        meta: {
          title: '用户列表'
        }
      }
    ]
  },


  // 3. 财务管理模块
  {
    path: '/finance',
    component: Home,
    meta: {
      title: '财务管理'
    },
    children: [
      {
        path: 'recharge',
        component: () => import('@/pages/hongbao/finance/RechargeList'),
        meta: {
          title: '充值管理'
        }
      },
      {
        path: 'withdraw',
        component: () => import('@/pages/hongbao/finance/WithdrawList'),
        meta: {
          title: '提现管理'
        }
      },
      {
        path: 'moneylog',
        component: () => import('@/pages/hongbao/finance/MoneyLog'),
        meta: {
          title: '资金流水'
        }
      },
      {
        path: 'depositaccounts',
        component: () => import('@/pages/hongbao/finance/DepositAccounts'),
        meta: {
          title: '收款账户'
        }
      }
    ]
  },

  // 4. Telegram管理模块
  {
    path: '/telegram',
    component: Home,
    meta: {
      title: 'Telegram管理'
    },
    children: [
      {
        path: 'redPacketList',
        component: () => import('@/pages/hongbao/redpacket/RedPacketList'),
        meta: {
          title: '红包管理'
        }
      },
      {
        path: 'redPacketRecords',
        component: () => import('@/pages/hongbao/redpacket/RecordList'),
        meta: {
          title: '领取记录'
        }
      },
      {
        path: 'advertisements',
        component: () => import('@/pages/hongbao/telegram/AdvertisementList'),
        meta: {
          title: '广告管理'
        }
      },
      {
        path: 'config',
        component: () => import('@/pages/hongbao/telegram/Config'),
        meta: {
          title: '配置管理'
        }
      }
    ]
  },

]

/**
 * 创建路由实例
 */
const router = new Router({
  routes: allowRouters
})

/**
 * 路由前置守卫
 * 在每次路由跳转前执行的钩子函数
 */
router.beforeEach((to, from, next) => {
  let isLogin = false
  let { meta, matched } = to
  let { title, newPage, keepAlive } = meta

  // 从本地存储获取系统状态信息
  let sys = JSON.parse(localStorage.getItem("sys"))

  // 检查用户登录状态
  if (sys) {
    isLogin = sys.user.isLogin
  }

  // 设置路由参数中的keepAlive状态
  to.params.keepAlive = keepAlive

  // 权限验证逻辑（当前被注释掉）
  // if(!isLogin && to.path !== '/login') {
  //   next('/login')
  //   return
  // } else {

    // 检查打开的页面是否存在
    if (!matched.length) {
      router.push('/exception/404')
      return
    }
    next()
  // }

  // 如果是新页面（如登录页），不添加到标签页管理
  if (newPage) {
    return
  }

  // 将路由添加到工作标签页管理
  store.dispatch('worktab/worktabRoute', {
    to: {
      name: to.name ? to.name : '',
      title: (to.meta && title) ? title : '',
      path: to.path,
      params: to.params
    },
    from: {
      name: from.name ? from.name : '',
      title: (from.meta && from.meta.title) ? from.meta.title : '',
      path: from.path,
      params: to.params
    }
  })

  // 设置网页标题
  if (title) {
    // document.title = `${title} - ${setting.systemName}` // 完整标题格式
    document.title = `${title}` // 简化标题格式
  }

  return
})

export default router
