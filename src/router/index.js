import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import Home from '@/pages/home/Home.vue'
import Console from '@/pages/dashboard/Console'
import setting from '@/config/setting'

Vue.use(Router)

/**
 * 不需要权限的基础路由配置
 * 这些路由可以直接访问，无需登录验证
 */
const routes = [
  {
    path: '/',
    redirect: '/dashboard/console' // 根路径重定向到控制面板
  },
  {
    path: '/dashboard',
    component: Home,
    meta: {
      title: '首页'
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
    path: '/login',
    component: () => import('@/pages/login/Login'),
    meta: {
      title: '登录',
      newPage: true // 标记为新页面，不加入标签页管理
    }
  },
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
  }
]

/**
 * 需要权限验证的路由配置
 * 这些路由需要用户登录后才能访问
 */
export const allowRouters = [
  {
    path: '/',
    redirect: '/login' // 根路径重定向到登录页
  },
  {
    path: '/login',
    component: () => import('@/pages/login/Login'),
    meta: {
      title: '登陆'
    }
  },
  {
    path: '/service',
    component: () => import('@/pages/service/Service'),
    meta: {
      title: '客服'
    }
  },
  
  // 仪表板模块
  {
    path: '/dashboard',
    component: Home,
    meta: {
      title: '控制面板'
    },
    children: [
      {
        path: 'console',
        component: Console,
        meta: {
          title: '控制面板'
        }
      },
      {
        path: 'syscontroll',
        component: () => import('@/pages/dashboard/syscontroll'),
        meta: {
          title: '系统控制'
        }
      }
    ]
  },

  // 系统设置模块
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
      }
    ]
  },

  // 用户管理模块
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
      },
      {
        path: 'useragent',
        component: () => import('@/pages/user/UserAgent'),
        meta: {
          title: '代理列表'
        }
      },
      {
        path: 'profit',
        component: () => import('@/pages/user/profit'),
        meta: {
          title: '盈亏列表'
        }
      },
      {
        path: 'usersort',
        component: () => import('@/pages/user/Usersort'),
        meta: {
          title: '收益排行'
        }
      },
      {
        path: 'agentlist',
        component: () => import('@/pages/user/Agentlist'),
        meta: {
          title: '代理关系链'
        }
      }
    ]
  },

  // 推广管理模块（文章管理）
  {
    path: '/extension',
    component: Home,
    meta: {
      title: '推广管理'
    },
    children: [
      {
        path: 'articletype',
        component: () => import('@/pages/extension/ArticleType'),
        meta: {
          title: '文章分类'
        }
      },
      {
        path: 'articlelist',
        component: () => import('@/pages/extension/ArticleList'),
        meta: {
          title: '文章内容列表'
        }
      }
    ]
  },

  // 视频管理模块
  // 注意：这里有重复的path '/extension'，应该修改为不同的路径
  {
    path: '/video', // 建议修改为 '/video' 避免路径冲突
    component: Home,
    meta: {
      title: '视频管理'
    },
    children: [
      {
        path: 'videotype',
        component: () => import('@/pages/extension/VideoType'),
        meta: {
          title: '视频分类'
        }
      },
      {
        path: 'videolist',
        component: () => import('@/pages/extension/VideoList'),
        meta: {
          title: '视频列表'
        }
      },
      {
        path: 'videovipList',
        component: () => import('@/pages/extension/videovipList'),
        meta: {
          title: '视频套餐列表'
        }
      }
    ]
  },

  // 系统管理模块
  {
    path: '/systemmng',
    component: Home,
    meta: {
      title: '系统管理'
    },
    children: [
      {
        path: 'configlist',
        component: () => import('@/pages/systemmng/ConfigList'),
        meta: {
          title: '配置列表'
        }
      },
      {
        path: 'ipconfiglist',
        component: () => import('@/pages/systemmng/ipConfigList'),
        meta: {
          title: '白名单列表'
        }
      }
    ]
  },

  // 消息管理模块
  {
    path: '/notice',
    component: Home,
    meta: {
      title: '消息管理'
    },
    children: [
      {
        path: 'noticelist',
        component: () => import('@/pages/notice/NoticeList'),
        meta: {
          title: '公告列表'
        }
      },
      {
        path: 'notifylist',
        component: () => import('@/pages/notice/NotifyList'),
        meta: {
          title: '通知列表'
        }
      }
    ]
  },

  // 平台管理模块
  {
    path: '/platform',
    component: Home,
    meta: {
      title: '平台管理'
    },
    children: [
      {
        path: 'agent',
        component: () => import('@/pages/platform/Agent'),
        meta: {
          title: '代理管理'
        }
      },
      {
        path: 'moneylog',
        component: () => import('@/pages/log/Moneylog'),
        meta: {
          title: '资金流动'
        }
      },
      {
        path: 'rechargelog',
        component: () => import('@/pages/log/Rechargelog'),
        meta: {
          title: '充值列表'
        }
      },
      {
        path: 'withdrawallog',
        component: () => import('@/pages/log/Withdrawallog'),
        meta: {
          title: '代理提现列表'
        }
      },
      {
        path: 'userTixianList',
        component: () => import('@/pages/log/UserTxianList'),
        meta: {
          title: '会员提现列表'
        }
      },
      {
        path: 'zhangHu',
        component: () => import('@/pages/log/ZhangHu'),
        meta: {
          title: '公司账号'
        }
      },
      {
        path: 'records',
        component: () => import('@/pages/log/Records'),
        meta: {
          title: '下注列表'
        }
      },
      {
        path: 'recordsmoney',
        component: () => import('@/pages/log/RecordsMoney'),
        meta: {
          title: '下注资金'
        }
      },
      {
        path: 'userlist',
        name: 'agentUserlist',
        component: () => import('@/pages/user/UserLists'),
        meta: {
          title: '用户列表'
        }
      },
      {
        path: 'useragent',
        component: () => import('@/pages/user/UserAgent'),
        meta: {
          title: '下级代理'
        }
      },
      {
        path: 'userxima',
        component: () => import('@/pages/log/UserXima'),
        meta: {
          title: '洗码列表'
        }
      },
      {
        path: 'userauth',
        component: () => import('@/pages/log/UserAuth'),
        meta: {
          title: '授权列表'
        }
      }
    ]
  },

  // 日志管理模块
  {
    path: '/log',
    component: Home,
    meta: {
      title: '日志管理'
    },
    children: [
      {
        path: 'actionlog',
        component: () => import('@/pages/log/Actionlog'),
        meta: {
          title: '操作日志'
        }
      },
      {
        path: 'userxima',
        name: 'loguserxima',
        component: () => import('@/pages/log/UserXima'),
        meta: {
          title: '洗码列表'
        }
      },
      {
        path: 'userauth',
        name: 'loguserauth',
        component: () => import('@/pages/log/UserAuth'),
        meta: {
          title: '授权列表'
        }
      },
      {
        path: 'moneylog',
        name: 'logMoneylog',
        component: () => import('@/pages/log/Moneylog'),
        meta: {
          title: '资金流动日志'
        }
      },
      {
        path: 'withdrawallog',
        name: 'financeWithdrawList',
        component: () => import('@/pages/log/Withdrawallog'),
        meta: {
          title: '代理提现'
        }
      },
      {
        path: 'rechargelog',
        name: 'financeRechargeList',
        component: () => import('@/pages/log/Rechargelog'),
        meta: {
          title: '充值列表'
        }
      },
      {
        path: 'order',
        component: () => import('@/pages/log/order'),
        meta: {
          title: '订单列表'
        }
      },
      {
        path: 'loginlog',
        component: () => import('@/pages/log/Loginlog'),
        meta: {
          title: '登陆日志'
        }
      },
      {
        path: 'records',
        name: 'logRecords',
        component: () => import('@/pages/log/Records'),
        meta: {
          title: '下注列表'
        }
      },
      {
        path: 'recordsmoney',
        name: 'recordsmoney',
        component: () => import('@/pages/log/RecordsMoney'),
        meta: {
          title: '下注资金'
        }
      }
    ]
  },

  // 台桌管理模块（游戏相关）
  {
    path: '/desktop',
    component: Home,
    meta: {
      title: '台桌管理'
    },
    children: [
      {
        path: 'desktoplist',
        component: () => import('@/pages/desktop/Desktoplist'),
        meta: {
          title: '台桌列表'
        }
      },
      {
        path: 'luzhulist',
        component: () => import('@/pages/desktop/Luzhulist'),
        meta: {
          title: '露珠列表'
        }
      },
      {
        path: 'voldlist',
        component: () => import('@/pages/desktop/Voldlist'),
        meta: {
          title: '作废露珠列表'
        }
      },
      {
        path: 'gamelist',
        component: () => import('@/pages/desktop/Gamelist'),
        meta: {
          title: '游戏列表'
        }
      },
      {
        path: 'oddslist',
        component: () => import('@/pages/desktop/Oddslist'),
        meta: {
          title: '赔率列表'
        }
      },
      {
        path: 'printluzhu',
        component: () => import('@/pages/desktop/Printluzhu'),
        meta: {
          title: '露珠打印'
        }
      }
    ]
  }
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
    
    // 获取菜单列表状态
    let { menuList } = store.state.menu

    // 如果菜单数据已加载成功
    if (menuList.length > 0) {
      // 检查打开的页面是否存在
      if (!matched.length) {
        router.push('/exception/404')
        return
      }
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