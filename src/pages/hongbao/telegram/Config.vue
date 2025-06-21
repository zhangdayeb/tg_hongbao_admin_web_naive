<template>
  <div class="config-container">
    <div class="page-header">
      <h2>机器人配置管理</h2>
      <p>配置Telegram机器人的欢迎消息和按钮</p>
      <div class="tip-notice">
        <i class="el-icon-info"></i>
        <span>欢迎词如果需要换行请插入 [换行] 程序会自动替换成telegram 里面的换行</span>
      </div>
    </div>

    <el-card v-loading="loading">
      <div slot="header">
        <span>配置信息</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="resetForm"
        >
          重置
        </el-button>
      </div>

      <el-form
        ref="configForm"
        :model="configData"
        :rules="rules"
        label-width="120px"
        size="medium"
      >
        <!-- 欢迎消息 -->
        <el-form-item label="欢迎消息" prop="welcome">
          <el-input
            v-model="configData.welcome"
            type="textarea"
            :rows="6"
            placeholder="请输入欢迎消息内容"
            maxlength="1000"
            show-word-limit
          />
          <div class="form-tip">
            注意：使用 [换行] 来表示换行
          </div>
        </el-form-item>

        <!-- 按钮配置 -->
        <div class="button-config-section">
          <h3>按钮配置</h3>

          <el-row :gutter="20" v-for="i in 6" :key="i">
            <el-col :span="12">
              <el-form-item :label="`按钮${i}名称`">
                <el-input
                  v-model="configData[`button${i}_name`]"
                  placeholder="请输入按钮名称"
                  maxlength="200"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="`按钮${i}链接`">
                <el-input
                  v-model="configData[`button${i}_url`]"
                  placeholder="请输入按钮链接"
                  maxlength="200"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            @click="saveConfig"
            :loading="saving"
          >
            保存配置
          </el-button>
          <el-button @click="loadConfig">
            重新加载
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>


  </div>
</template>

<script>
import { getBotConfigApi, updateBotConfigApi } from '@/api/telegramApi'

export default {
  name: 'Config',
  data() {
    return {
      loading: false,
      saving: false,

      // 配置数据
      configData: {
        welcome: '',
        button1_name: '',
        button1_url: '',
        button2_name: '',
        button2_url: '',
        button3_name: '',
        button3_url: '',
        button4_name: '',
        button4_url: '',
        button5_name: '',
        button5_url: '',
        button6_name: '',
        button6_url: ''
      },

      // 表单验证规则
      rules: {
        welcome: [
          { required: true, message: '请输入欢迎消息', trigger: 'blur' },
          { min: 10, message: '欢迎消息至少10个字符', trigger: 'blur' }
        ]
      }
    }
  },

  mounted() {
    this.loadConfig()
  },

  methods: {
    // 加载配置
    async loadConfig() {
      this.loading = true
      try {
        const res = await getBotConfigApi()

        if (res.code === 1) {
          // 如果有数据，使用返回的数据
          if (res.data) {
            this.configData = {
              welcome: res.data.welcome || '',
              button1_name: res.data.button1_name || '',
              button1_url: res.data.button1_url || '',
              button2_name: res.data.button2_name || '',
              button2_url: res.data.button2_url || '',
              button3_name: res.data.button3_name || '',
              button3_url: res.data.button3_url || '',
              button4_name: res.data.button4_name || '',
              button4_url: res.data.button4_url || '',
              button5_name: res.data.button5_name || '',
              button5_url: res.data.button5_url || '',
              button6_name: res.data.button6_name || '',
              button6_url: res.data.button6_url || ''
            }
          }
          this.$message.success('配置加载成功')
        } else {
          this.$message.error(res.message || '加载配置失败')
        }
      } catch (error) {
        console.error('加载配置失败:', error)
        this.$message.error('网络错误，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    // 保存配置
    async saveConfig() {
      try {
        // 表单验证
        const valid = await this.$refs.configForm.validate()
        if (!valid) {
          return
        }

        this.saving = true
        const res = await updateBotConfigApi(this.configData)

        if (res.code === 1) {
          this.$message.success('配置保存成功')
        } else {
          this.$message.error(res.message || '保存配置失败')
        }
      } catch (error) {
        console.error('保存配置失败:', error)
        this.$message.error('网络错误，请稍后重试')
      } finally {
        this.saving = false
      }
    },

    // 重置表单
    resetForm() {
      this.$refs.configForm.resetFields()
      this.loadConfig()
    }
  }
}
</script>

<style scoped>
.config-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
}

.page-header p {
  margin: 0 0 10px 0;
  color: #909399;
  font-size: 14px;
}

.tip-notice {
  padding: 12px 16px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  color: #1890ff;
  font-size: 14px;
}

.tip-notice i {
  margin-right: 8px;
}

.button-config-section {
  margin: 30px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.button-config-section h3 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.el-form-item {
  margin-bottom: 22px;
}

.el-card {
  border-radius: 8px;
}

.el-card ::v-deep .el-card__header {
  border-bottom: 1px solid #f0f0f0;
  padding: 18px 20px;
}

.el-card ::v-deep .el-card__body {
  padding: 20px;
}
</style>
