// src/store/modules/notification.js

const state = {
  // 弹窗显示状态
  visible: false,
  
  // 通知类型 'recharge' | 'withdraw'
  type: 'recharge',
  
  // 通知金额
  amount: 0,
  
  // 用户名
  userName: '',
  
  // 通知时间
  time: '',
  
  // 已经提示过的记录ID列表 (防重复提示)
  notifiedRecords: [],
  
  // 最后检查的时间戳
  lastCheckTime: null,
  
  // 轮询是否启用
  pollingEnabled: false
}

const mutations = {
  // 显示通知弹窗
  SHOW_NOTIFICATION: function(state, payload) {
    state.visible = true
    state.type = payload.type || 'recharge'
    state.amount = payload.amount || 0
    state.userName = payload.userName || '用户'
    state.time = payload.time || new Date().toLocaleString()
  },
  
  // 隐藏通知弹窗
  HIDE_NOTIFICATION: function(state) {
    state.visible = false
  },
  
  // 重置通知状态
  RESET_NOTIFICATION: function(state) {
    state.visible = false
    state.type = 'recharge'
    state.amount = 0
    state.userName = ''
    state.time = ''
  },
  
  // 添加已通知的记录ID
  ADD_NOTIFIED_RECORD: function(state, recordId) {
    if (state.notifiedRecords.indexOf(recordId) === -1) {
      state.notifiedRecords.push(recordId)
      
      // 限制数组长度，只保留最近100条记录
      if (state.notifiedRecords.length > 100) {
        state.notifiedRecords = state.notifiedRecords.slice(-100)
      }
    }
  },
  
  // 批量添加已通知的记录ID
  SET_NOTIFIED_RECORDS: function(state, recordIds) {
    state.notifiedRecords = recordIds || []
  },
  
  // 更新最后检查时间
  UPDATE_LAST_CHECK_TIME: function(state, timestamp) {
    state.lastCheckTime = timestamp || Date.now()
  },
  
  // 设置轮询状态
  SET_POLLING_STATUS: function(state, enabled) {
    state.pollingEnabled = enabled
  },
  
  // 清空已通知记录 (可用于重置或清理)
  CLEAR_NOTIFIED_RECORDS: function(state) {
    state.notifiedRecords = []
  }
}

const actions = {
  // 显示通知 (可以在这里添加额外逻辑)
  showNotification: function(context, payload) {
    // 记录这条记录已经被通知过
    if (payload.recordId) {
      context.commit('ADD_NOTIFIED_RECORD', payload.recordId)
    }
    
    // 显示通知
    context.commit('SHOW_NOTIFICATION', payload)
  },
  
  // 关闭通知
  closeNotification: function(context) {
    context.commit('HIDE_NOTIFICATION')
  },
  
  // 检查是否是新记录 (未被通知过的)
  isNewRecord: function(context, recordId) {
    return context.state.notifiedRecords.indexOf(recordId) === -1
  },
  
  // 启动通知系统
  startNotificationSystem: function(context) {
    context.commit('SET_POLLING_STATUS', true)
    context.commit('UPDATE_LAST_CHECK_TIME')
    
    // 可以在这里初始化轮询服务
    console.log('通知系统已启动')
  },
  
  // 停止通知系统
  stopNotificationSystem: function(context) {
    context.commit('SET_POLLING_STATUS', false)
    console.log('通知系统已停止')
  },
  
  // 初始化通知数据 (从localStorage恢复数据)
  initNotificationData: function(context) {
    try {
      // 从本地存储恢复已通知的记录
      var savedRecords = localStorage.getItem('notified_records')
      if (savedRecords) {
        var records = JSON.parse(savedRecords)
        context.commit('SET_NOTIFIED_RECORDS', records)
      }
      
      // 从本地存储恢复最后检查时间
      var lastTime = localStorage.getItem('last_check_time')
      if (lastTime) {
        context.commit('UPDATE_LAST_CHECK_TIME', parseInt(lastTime))
      }
    } catch (error) {
      console.warn('初始化通知数据失败:', error)
    }
  },
  
  // 保存通知数据到localStorage
  saveNotificationData: function(context) {
    try {
      localStorage.setItem('notified_records', JSON.stringify(context.state.notifiedRecords))
      localStorage.setItem('last_check_time', context.state.lastCheckTime.toString())
    } catch (error) {
      console.warn('保存通知数据失败:', error)
    }
  }
}

const getters = {
  // 获取通知显示状态
  isNotificationVisible: function(state) {
    return state.visible
  },
  
  // 获取当前通知信息
  currentNotification: function(state) {
    return {
      visible: state.visible,
      type: state.type,
      amount: state.amount,
      userName: state.userName,
      time: state.time
    }
  },
  
  // 获取已通知记录数量
  notifiedRecordsCount: function(state) {
    return state.notifiedRecords.length
  },
  
  // 检查轮询是否启用
  isPollingEnabled: function(state) {
    return state.pollingEnabled
  },
  
  // 获取最后检查时间的格式化字符串
  lastCheckTimeFormatted: function(state) {
    if (!state.lastCheckTime) return '从未检查'
    return new Date(state.lastCheckTime).toLocaleString()
  }
}

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}