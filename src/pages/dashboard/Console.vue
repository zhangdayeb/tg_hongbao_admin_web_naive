<template>
  <div class="console-container">
    <div class="console-header">
      <h1>控制台</h1>
      <p>欢迎使用管理后台系统</p>
    </div>

    <div class="console-content">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>总用户数</h3>
              <p class="stat-number">1,234</p>
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <h3>今日收入</h3>
              <p class="stat-number">¥12,345</p>
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <h3>活跃用户</h3>
              <p class="stat-number">567</p>
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">🔔</div>
            <div class="stat-info">
              <h3>系统消息</h3>
              <p class="stat-number">8</p>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="welcome-message">
        <h2>🎉 系统运行正常</h2>
        <p>所有功能模块已就绪，请从左侧菜单开始使用各项功能。</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Console',
  data() {
    return {
      // 这里可以添加一些数据
    }
  },
  mounted() {
    console.log('控制台页面已加载')
  },
  methods: {
    // 这里可以添加一些方法
  }
}
</script>

<style lang="scss" scoped>
.console-container {
  padding: 20px;

  .console-header {
    text-align: center;
    margin-bottom: 30px;

    h1 {
      font-size: 32px;
      color: #303133;
      margin-bottom: 10px;
    }

    p {
      font-size: 16px;
      color: #909399;
    }
  }

  .console-content {
    .stat-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      .stat-icon {
        font-size: 40px;
        margin-right: 15px;
      }

      .stat-info {
        flex: 1;

        h3 {
          font-size: 14px;
          color: #909399;
          margin: 0 0 8px 0;
        }

        .stat-number {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
          margin: 0;
        }
      }
    }

    .welcome-message {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      border-radius: 12px;
      text-align: center;
      margin-top: 30px;

      h2 {
        font-size: 28px;
        margin-bottom: 15px;
      }

      p {
        font-size: 16px;
        opacity: 0.9;
      }
    }
  }
}
</style>
