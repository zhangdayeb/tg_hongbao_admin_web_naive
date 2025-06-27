<template>
  <div id="app" style="height: 100%">
    <router-view/>
    
    <!-- 全局通知弹窗 - 只需要在这里引入一次 -->
    <NotificationModal
      :visible="$store.state.notification.visible"
      :type="$store.state.notification.type"
      :amount="$store.state.notification.amount"
      :userName="$store.state.notification.userName"
      @close="closeNotification"
    />

  </div>
</template>

<script>
  import NotificationModal from '@/components/NotificationModal'
  import pollingService from '@/utils/pollingService'

  import axios from 'axios'
  import { allowRouters } from '@/router/index.js'
  export default {
    name: 'App',
    components: {
      NotificationModal
    },
    mounted() {
      // 初始化通知数据
      this.$store.dispatch('notification/initNotificationData')
      
      // 启动轮询服务
      pollingService.start()
    },
    beforeDestroy() {
      // 组件销毁时停止轮询
      pollingService.stop()
    },
    created() {
      this.initState()
      this.getMenuList()
    },
    methods: {
      closeNotification() {
        this.$store.commit('notification/HIDE_NOTIFICATION')
      },
      // 初始化State
      initState() {
        this.$store.dispatch('user/initState')
        this.$store.dispatch('worktab/initState')
        this.$store.dispatch('setting/initState')
      },
      // 获取菜单列表
      getMenuList() {
        let{ href } = location
        let url = ''
        if(href.indexOf('localhost') === -1) {
          url = '/' + href.split('/')[3] + url

        }        
      },
      /**
       * 根据权限匹配路由并返回
       * @param {array} permission    后台返回的权限列表（菜单列表）
       * @param {array} allowRouters  需要权限的路由表
       */
      routerMatch(permission, allowRouters) {
        return new Promise((resolve) => {
          const routers = []
          function createRouter(permission) {
            permission.forEach((item) => {
              let { path } = item
              let pathArr = path && path.split('/')

              if(pathArr) {
                path = pathArr[pathArr.length-1]
              }

              if (item.children && item.children.length) {
                createRouter(item.children)
              }

              allowRouters.find((s) => {
                if (s.children) {
                  s.children.find((y) => {
                    if (y.path === path) {
                      y.meta.permission = item.permission
                      routers.push(s);
                    }
                  })
                }else {
                  if (path && s.path === path) {
                    s.meta.permission = item.permission
                    routers.push(s);
                  }
                }
              })
            })
          }
          createRouter(permission)
          resolve(Array.from(new Set(routers)))
        })
      }
    }
  }
</script>
