<template>
  <div class="console-container">
    <div class="console-header">
      <h1>控制台</h1>
      <p>欢迎使用管理后台系统</p>
    </div>

    <div class="console-content">
      <div class="welcome-message">
        <h2>🎉 欢迎来到控制台</h2>
        <p>系统已准备就绪，祝您使用愉快！</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Console',
  mounted() {
    console.log('控制台页面已加载')
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
