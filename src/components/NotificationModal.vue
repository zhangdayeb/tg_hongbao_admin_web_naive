<template>
  <div class="notification-modal-wrapper">
    <!-- 遮罩层 -->
    <div 
      v-show="visible" 
      class="notification-overlay"
      @click="handleClose"
    ></div>
    
    <!-- 弹窗主体 -->
    <transition name="slide-fade">
      <div 
        v-show="visible" 
        class="notification-modal"
        :class="notificationTypeClass"
      >
        <!-- 关闭按钮 -->
        <el-button 
          class="close-btn" 
          type="text" 
          icon="el-icon-close"
          @click="handleClose"
        ></el-button>
        
        <!-- 图标区域 -->
        <div class="notification-icon">
          <i :class="iconClass"></i>
        </div>
        
        <!-- 内容区域 -->
        <div class="notification-content">
          <h3 class="notification-title">{{ title }}</h3>
          <p class="notification-message">{{ message }}</p>
          <div class="notification-amount">{{ formatAmount }}</div>
          <div class="notification-time">{{ formatTime }}</div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="notification-actions">
          <el-button 
            type="primary" 
            size="small" 
            @click="handleClose"
          >
            知道了
          </el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'NotificationModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'recharge', // recharge | withdraw
      validator: function(value) {
        return ['recharge', 'withdraw'].indexOf(value) !== -1
      }
    },
    amount: {
      type: [String, Number],
      default: '0.00'
    },
    userName: {
      type: String,
      default: '用户'
    },
    time: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      rechargeAudio: null,
      withdrawAudio: null
    }
  },
  computed: {
    // 弹窗类型样式
    notificationTypeClass: function() {
      return {
        'notification-recharge': this.type === 'recharge',
        'notification-withdraw': this.type === 'withdraw'
      }
    },
    
    // 图标样式
    iconClass: function() {
      return this.type === 'recharge' 
        ? 'el-icon-wallet' 
        : 'el-icon-money'
    },
    
    // 标题
    title: function() {
      return this.type === 'recharge' ? '充值通知' : '提现通知'
    },
    
    // 消息内容
    message: function() {
      return this.type === 'recharge' 
        ? this.userName + ' 刚刚完成了充值操作' 
        : this.userName + ' 刚刚完成了提现操作'
    },
    
    // 格式化金额
    formatAmount: function() {
      if (typeof this.amount === 'number') {
        return '¥ ' + this.amount.toFixed(2)
      }
      return '¥ ' + this.amount
    },
    
    // 格式化时间
    formatTime: function() {
      if (!this.time) {
        return new Date().toLocaleString()
      }
      return this.time
    }
  },
  mounted: function() {
    // 预加载音频文件
    this.initAudio()
  },
  methods: {
    // 初始化音频
    initAudio: function() {
      try {
        this.rechargeAudio = new Audio(require('@/assets/sound/recharge.mp3'))
        this.withdrawAudio = new Audio(require('@/assets/sound/withdraw.mp3'))
        
        // 设置音量
        if (this.rechargeAudio) this.rechargeAudio.volume = 0.5
        if (this.withdrawAudio) this.withdrawAudio.volume = 0.5
      } catch (error) {
        console.warn('音频文件加载失败:', error)
      }
    },
    
    // 关闭弹窗
    handleClose: function() {
      this.$emit('close')
    },
    
    // 播放提示音
    playSound: function() {
      try {
        var audio = this.type === 'recharge' ? this.rechargeAudio : this.withdrawAudio
        if (audio) {
          audio.currentTime = 0 // 重置播放位置
          audio.play().catch(function(err) {
            console.warn('音频播放失败:', err)
          })
        }
      } catch (error) {
        console.warn('音频播放出错:', error)
      }
    }
  },
  watch: {
    // 监听弹窗显示，自动播放音效
    visible: function(newVal) {
      var self = this
      if (newVal) {
        this.$nextTick(function() {
          self.playSound()
        })
      }
    }
  }
}
</script>

<style scoped>
.notification-modal-wrapper {
  position: relative;
}

/* 遮罩层 */
.notification-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2000;
}

/* 弹窗主体 */
.notification-modal {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 2001;
  overflow: hidden;
  border-left: 4px solid #409eff;
}

/* 充值样式 */
.notification-recharge {
  border-left-color: #67c23a;
}

/* 提现样式 */
.notification-withdraw {
  border-left-color: #f56c6c;
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 5px !important;
  min-width: auto !important;
  color: #999;
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #666;
}

/* 图标区域 */
.notification-icon {
  text-align: center;
  padding: 20px 20px 10px;
}

.notification-icon i {
  font-size: 48px;
  color: #409eff;
}

.notification-recharge .notification-icon i {
  color: #67c23a;
}

.notification-withdraw .notification-icon i {
  color: #f56c6c;
}

/* 内容区域 */
.notification-content {
  padding: 0 20px 10px;
  text-align: center;
}

.notification-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.notification-message {
  margin: 0 0 10px;
  font-size: 14px;
  color: #606266;
  line-height: 1.4;
}

.notification-amount {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #409eff;
}

.notification-recharge .notification-amount {
  color: #67c23a;
}

.notification-withdraw .notification-amount {
  color: #f56c6c;
}

.notification-time {
  font-size: 12px;
  color: #909399;
}

/* 操作按钮 */
.notification-actions {
  padding: 15px 20px 20px;
  text-align: center;
}

/* 动画效果 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .notification-modal {
    width: 300px;
    right: 10px;
    bottom: 10px;
  }
}
</style>