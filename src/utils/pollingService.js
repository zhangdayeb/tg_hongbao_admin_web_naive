// src/utils/pollingService.js
import { getLatestRecords } from '@/api/notificationApi'
import store from '@/store'

class PollingService {
  constructor() {
    this.timer = null
    this.interval = 15000 // 15秒轮询一次
    this.isRunning = false
    this.retryCount = 0
    this.maxRetries = 3
  }

  /**
   * 启动轮询
   * @param {number} interval 轮询间隔（毫秒），默认15秒
   */
  start(interval) {
    if (this.isRunning) {
      console.warn('轮询服务已在运行中')
      return
    }

    if (interval) {
      this.interval = interval
    }

    console.log('启动通知轮询服务，间隔:', this.interval + 'ms')
    
    this.isRunning = true
    this.retryCount = 0
    
    // 立即执行一次
    this.poll()
    
    // 设置定时器
    this.timer = setInterval(() => {
      this.poll()
    }, this.interval)

    // 更新store状态
    store.dispatch('notification/startNotificationSystem')
  }

  /**
   * 停止轮询
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    
    this.isRunning = false
    console.log('通知轮询服务已停止')
    
    // 更新store状态
    store.dispatch('notification/stopNotificationSystem')
  }

  /**
   * 重启轮询
   */
  restart() {
    this.stop()
    setTimeout(() => {
      this.start()
    }, 1000)
  }

  /**
   * 执行一次轮询检查
   */
  async poll() {
    try {
      console.log('执行通知轮询检查...')
      
      // 获取最后检查时间
      const lastCheckTime = store.state.notification.lastCheckTime
      
      // 调用API获取最新记录
      const response = await getLatestRecords({
        lastCheckTime: lastCheckTime
      })

      // 处理API响应
      if (response && response.code === 1) {
        const records = response.data.records || []
        
        if (records.length > 0) {
          console.log('发现新记录:', records.length + '条')
          this.processNewRecords(records)
        } else {
          console.log('没有新记录')
        }
        
        // 更新最后检查时间
        store.commit('notification/UPDATE_LAST_CHECK_TIME')
        
        // 重置重试计数
        this.retryCount = 0
        
      } else {
        console.warn('API响应异常:', response)
        this.handleError(new Error('API响应格式错误'))
      }

    } catch (error) {
      console.error('轮询检查失败:', error)
      this.handleError(error)
    }
  }

  /**
   * 处理新记录
   * @param {Array} records 新记录列表
   */
  processNewRecords(records) {
    records.forEach(record => {
      // 检查是否已经通知过
      const isNotified = store.state.notification.notifiedRecords.indexOf(record.id) !== -1
      
      if (!isNotified) {
        // 显示通知
        store.dispatch('notification/showNotification', {
          type: record.type,
          amount: record.amount,
          userName: record.userName || '用户',
          time: record.createTime,
          recordId: record.id
        })
        
        console.log('显示通知:', record.type, record.amount, record.userName)
        
        // 记录已通知
        store.commit('notification/ADD_NOTIFIED_RECORD', record.id)
      }
    })
    
    // 保存数据到localStorage
    store.dispatch('notification/saveNotificationData')
  }

  /**
   * 处理错误
   * @param {Error} error 错误对象
   */
  handleError(error) {
    this.retryCount++
    
    if (this.retryCount >= this.maxRetries) {
      console.error('轮询服务达到最大重试次数，暂停轮询')
      this.stop()
      
      // 可以在这里显示错误提示
      // this.$message.error('通知服务连接失败，请刷新页面重试')
      
    } else {
      console.warn(`轮询失败，${5}秒后重试 (${this.retryCount}/${this.maxRetries})`)
      
      // 短暂延迟后重试
      setTimeout(() => {
        if (this.isRunning) {
          this.poll()
        }
      }, 5000)
    }
  }

  /**
   * 获取轮询状态
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      interval: this.interval,
      retryCount: this.retryCount,
      lastCheckTime: store.state.notification.lastCheckTime
    }
  }

  /**
   * 设置轮询间隔
   * @param {number} interval 新的间隔时间（毫秒）
   */
  setInterval(interval) {
    this.interval = interval
    
    if (this.isRunning) {
      this.restart()
    }
  }
}

// 创建单例实例
const pollingService = new PollingService()

export default pollingService