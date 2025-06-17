<template>
  <div class="menu-left" v-if="showMenuMobile">
    <div class="header" :style="{background: theme.menuLeftBc}" @click="goPage('/dashboard/console')">
      <!-- <svg class="svg-icon" aria-hidden="true">
        <use xlink:href="#iconzhaopian-copy"></use>
      </svg> -->
      <img class="menu-left-log"  src="~@/assets/img/login/yb12.png" alt="" srcset="">
      <p :style="{color: theme.textColor, width: collapse ? '0' : '120px'}">用户({{user_name}})</p>
    </div>

    <el-menu class="el-menu" :class="'el-menu-'+ theme.theme"
      :collapse="collapse"
      :default-active="routerPath"
      :text-color="theme.textColor"
      :unique-opened="uniqueOpened"
      :background-color="theme.menuLeftBc"
      :active-text-color="theme.activeColor"
      :default-openeds="defaultOpenedsArray"
    >
      <submenu :list="menuList" :isMobile="isMobileModel" @close="closeMenu"/>
    </el-menu>

    <div class="menu-model" @click="visibleMenu()" :style="{
      opacity: collapse ? 0 : 1,
      transform: showMobileModel ? 'scale(1)' : 'scale(0)'
    }">
    </div>
  </div>
</template>

<script>
  import setting from '@/config/setting'
  import Submenu from './Submenu.vue';
  import { mapState } from 'vuex'
  export default {
    name: "MenuLeft",
    inject: ['reload'],
    components: {
      Submenu
    },
    computed: {
      ...mapState({
        worktab: state => state.worktab.worktab,
        setting: state => state.setting.setting,
        menu: state => state.menu
      }),
      routerPath() {
        let { current } = this.worktab
        let { path, params } = current
        let { status } = current.params

        // 个人中心折叠菜单
        if(path === '/user/user') {
          this.defaultOpenedsArray = []
        }

        return status ? path + params.status : path
      }
    },
    watch: {
      'setting.theme': {
        handler(theme) {
          this.getTheme(theme)
        },
        immediate: true
      },
      'setting.uniqueOpened' (uniqueOpened) {
        this.uniqueOpened = uniqueOpened
      },
      'menu.menuList' (list) {
        this.menuList = list
      }
    },
    data() {
      return {
        user_name:'',
        status: '',
        systemName: setting.systemName, // 系统名称
        menuList: [],                   // 菜单数据
        collapse: false,                // 是否水平折叠收起菜单
        collapseMobile: false,           // 移动端菜header折叠
        theme: {},                      // 主题
        uniqueOpened: '',               // 是否只保持一个子菜单的展开
        screenWidth: '',
        isMobileModel: false,
        showMenuMobile: false,
        showMobileModel: false,
        resizeList: [0, 0],
        defaultOpenedsArray: []
      }
    },
    mounted() {
      localStorage
      this.user_name = localStorage.getItem('user_name')
      this.getMenuList()
      this.initUserSetting()
      this.listenerWindowResize()
    },
    methods: {
      // 获取菜单列表|权限列表
      getMenuList() {
        // 根据数据库表结构设计的完整菜单配置
        const fixedMenuList = [
          {
            id: 1,
            title: '控制台',
            path: '/dashboard',
            icon: 'el-icon-s-home',
            children: [
              {
                id: 11,
                title: '控制面板',
                path: '/dashboard/console'
              }
            ]
          },
          {
            id: 2,
            title: '用户管理',
            path: '/user',
            icon: 'el-icon-user',
            children: [
              {
                id: 21,
                title: '用户列表',
                path: '/user/list',
                desc: '管理ntp_common_user表数据'
              },
              {
                id: 25,
                title: '邀请管理',
                path: '/user/invitation',
                desc: '管理ntp_user_invitations表'
              }
            ]
          },
          {
            id: 3,
            title: '财务管理',
            path: '/finance',
            icon: 'el-icon-money',
            children: [
              {
                id: 31,
                title: '充值管理',
                path: '/finance/recharge',
                desc: '管理ntp_common_pay_recharge表'
              },
              {
                id: 32,
                title: '提现管理',
                path: '/finance/withdraw',
                desc: '管理ntp_common_pay_withdraw表'
              },
              {
                id: 33,
                title: '资金流水',
                path: '/finance/money-log',
                desc: '管理ntp_common_pay_money_log表'
              },
              {
                id: 34,
                title: '充值方式',
                path: '/finance/deposit-methods',
                desc: '管理ntp_dianji_deposit_methods表'
              },
              {
                id: 35,
                title: '收款账户',
                path: '/finance/deposit-accounts',
                desc: '管理ntp_dianji_deposit_accounts表'
              },
              {
                id: 36,
                title: '邀请奖励',
                path: '/finance/invitation-rewards',
                desc: '管理ntp_invitation_rewards表'
              }
            ]
          },
          {
            id: 4,
            title: 'Telegram管理',
            path: '/telegram',
            icon: 'el-icon-chat-line-round',
            children: [
              {
                id: 41,
                title: '群组管理',
                path: '/telegram/groups',
                desc: '管理ntp_tg_crowd_list表'
              },
              {
                id: 42,
                title: '消息记录',
                path: '/telegram/messages',
                desc: '管理ntp_tg_messages表'
              },
              {
                id: 43,
                title: '消息日志',
                path: '/telegram/message-logs',
                desc: '管理ntp_tg_message_logs表'
              },
              {
                id: 44,
                title: '广告管理',
                path: '/telegram/advertisements',
                desc: '管理ntp_tg_advertisements表'
              }
            ]
          },
          {
            id: 5,
            title: '红包系统',
            path: '/redpacket',
            icon: 'el-icon-present',
            children: [
              {
                id: 51,
                title: '红包管理',
                path: '/redpacket/list',
                desc: '管理ntp_tg_red_packets表'
              },
              {
                id: 52,
                title: '领取记录',
                path: '/redpacket/records',
                desc: '管理ntp_tg_red_packet_records表'
              },
              {
                id: 53,
                title: '红包统计',
                path: '/redpacket/statistics'
              },
              {
                id: 54,
                title: '发送红包',
                path: '/redpacket/send'
              }
            ]
          },
          {
            id: 7,
            title: '数据统计',
            path: '/statistics',
            icon: 'el-icon-pie-chart',
            children: [
              {
                id: 71,
                title: '用户统计',
                path: '/statistics/users'
              },
              {
                id: 72,
                title: '财务统计',
                path: '/statistics/finance'
              },
              {
                id: 73,
                title: 'TG群组统计',
                path: '/statistics/telegram'
              },
              {
                id: 74,
                title: '红包统计',
                path: '/statistics/redpacket'
              },
              {
                id: 75,
                title: '推广统计',
                path: '/statistics/promotion'
              }
            ]
          },
          {
            id: 8,
            title: '系统设置',
            path: '/system',
            icon: 'el-icon-setting',
            children: [
              {
                id: 81,
                title: '管理员管理',
                path: '/system/admin',
                desc: '管理ntp_common_admin表'
              }
            ]
          }
        ]

        this.menuList = fixedMenuList

      },
      // 获取主题
      getTheme(theme) {
        if(theme) {
          let t = setting.themeList.filter((item) => {
            return item.theme === theme
          })
          this.theme = t[0]
        }
      },
      // 初始化用户设置
      initUserSetting() {
        this.uniqueOpened = this.setting.uniqueOpened
      },
      // 菜单展开 | 收缩
      visibleMenu() {
        this.collapse = !this.collapse

        setTimeout(() => {
          this.collapseMobile = !this.collapseMobile
        }, 200)

        // 移动端模态框
        if(!this.showMobileModel) {
          this.showMobileModel = true
        }else {
          setTimeout(() => {
            this.showMobileModel = false
          }, 200)
        }
      },
      listenerWindowResize() {
        this.screenWidth = document.body.clientWidth;
        this.setMenuModel()

        window.onresize = () => {
          return (() => {
            this.screenWidth = document.body.clientWidth;
            this.setMenuModel()
          })();
        };
      },
      setMenuModel() {
        let { screenWidth, resizeList } = this

        if(screenWidth > 800) {
          if(resizeList[0] === 0) {
            this.isMobileModel = false
            this.collapse = false
            this.collapseMobile = false
            this.showMenuMobile = true
            this.$emit('topBarCollapse', true)
          }

          this.$set(this.resizeList, 0, 1)
        }else {
          this.isMobileModel = true
          this.collapse = true
          this.$emit('topBarCollapse', false)
          this.collapseMobile = true
          this.showMobileModel = false
          this.$set(this.resizeList, 0, 0)
        }

        setTimeout(() => {
          this.showMenuMobile = true
        }, 10)
      },
      closeMenu() {
        this.collapse = true
        this.collapseMobile = true
        this.showMobileModel = false
      },
      goPage(path) {
        if(this.$route.path !== path) {
          this.$router.push(path)
        }
      }
    }
  };
</script>

<style lang="scss">
  .menu-left {
    // 黑色主题
    .el-menu-dark {
      // 选中颜色
      .el-menu-item.is-active {
        background: #2d8cf0 !important;
      }

      // 鼠标移入背景色
      .el-submenu__title:hover {
        background: #121319 !important;
      }
    }

    // 白色主题
    .el-menu-white  {

      // box-shadow: 5px 5px 8px 0 red;

      // 选中颜色
      .el-menu-item.is-active {
        background: #F0FAFF !important;

        // 左侧线条
        &::before {
          content: '';
          width: 3px;
          height: 100%;
          position: absolute;
          left: 0;
          background: #3296FA;
        }
      }

      // 鼠标移入背景色
      .el-submenu__title:hover,
      .el-submenu .el-menu-item:hover {
        color: #3296FA !important;
        background: #F0FAFF !important;
      }

      // 鼠标移入图标颜色
      .el-submenu__title:hover i,
      .el-submenu .el-menu-item:hover i {
        color: #3296FA !important;
      }
    }

    // 折叠后宽度
    .el-menu--collapse {
      width: $menu-left-shrink-width;
    }
    // 左边距
    .el-submenu__title {
      padding-left: 25px !important;
    }
    // 设置文字与图标的距离
    .el-submenu__title span {
      margin-left: 10px;
    }
    .el-submenu .el-menu-item span{
      margin-left: 15px;
    }
    // 箭头加粗
    .el-submenu__icon-arrow {
      font-weight: bold;
    }
  }
</style>

<style lang="scss" scoped>
  .menu-left {
    height: 100vh;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    box-shadow: 5px 5px 8px 0 rgba(29,35,41,.05);

    .menu-left-log{
      width: 32px;
      height: 32px;
      margin-left: 25px;
    }

    .el-menu--collapse {
      >>> .el-submenu__title span,
      >>> .el-submenu__icon-arrow {
        display: none;
      }
    }

    .header {
      height: 45px;
      line-height: 45px;
      box-sizing: border-box;
      cursor: pointer;
      display: flex;
      align-items: center;
      overflow: hidden;

      .svg-icon {
        width: 22px;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
        margin-left: -2px;
        margin-top: 10px;
        margin-left: 25px;
      }

      p {
        color: #C3C3C3;
        font-size: 15px;
        margin-left: 10px;
        margin-top: 5px;
        overflow: hidden;
        transition: width .3s ease-in-out;
      }
    }

    .el-menu {
      border-right: 0;
      height: calc(100vh - 45px);
      box-sizing: border-box;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 0px !important;
      }
    }

    .el-menu:not(.el-menu--collapse) {
      width: $menu-left-open-width;
    }

    .menu-model {
      display: none;
    }
  }

  @media only screen and (max-width: $device-ipad) {
    .menu-left {
      .header {
        display: none;
      }

      .el-menu {
        height: 100vh;
      }

      .el-menu--collapse {
        width: 0;
      }

      .menu-model {
        display: block;
        width: 100%;
        height: 100vh;
        position: fixed;
        z-index: -1;
        left: 0;
        top: 0;
        background: rgba($color: #000000, $alpha: 0.5);
        transition: opacity .2s ease-in-out;
      }
    }
  }
</style>
