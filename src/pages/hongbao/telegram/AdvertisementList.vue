<template>
  <div class="advertisement-list">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>广告管理</h2>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline size="small">
        <el-form-item label="标题搜索">
          <el-input
            v-model="searchForm.title"
            placeholder="广告标题"
            style="width: 200px;"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading">
            <i class="el-icon-search"></i> 搜索
          </el-button>
          <el-button @click="handleReset">
            <i class="el-icon-refresh"></i> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮区域 -->
    <el-card class="action-card" shadow="never">
      <el-button type="primary" @click="handleAdd" icon="el-icon-plus">
        新增广告
      </el-button>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <el-table
        :data="advertisementList"
        v-loading="loading"
        stripe
        style="width: 100%"
      >
        <el-table-column label="ID" prop="id" width="80" align="center" />

        <el-table-column label="标题" prop="title" width="200" show-overflow-tooltip />

        <el-table-column label="内容" width="300" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.content && scope.row.content.length > 50 ?
                scope.row.content.substring(0, 50) + '...' : scope.row.content }}
          </template>
        </el-table-column>

        <el-table-column label="图片" width="100" align="center">
          <template slot-scope="scope">
            <img
              v-if="scope.row.image_url"
              :src="scope.row.image_url"
              class="table-image"
              @click="handleImagePreview(scope.row.image_url)"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column label="发送模式" width="120" align="center">
          <template slot-scope="scope">
            <el-tag :type="getSendModeType(scope.row.send_mode)" size="small">
              {{ getSendModeText(scope.row.send_mode) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="发送时间/配置" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.send_mode === 1">
              {{ scope.row.send_time || '-' }}
            </div>
            <div v-else-if="scope.row.send_mode === 2">
              每日：{{ scope.row.daily_times || '-' }}
            </div>
            <div v-else-if="scope.row.send_mode === 3">
              间隔：{{ scope.row.interval_minutes }}分钟
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="成功率" width="100" align="center">
          <template slot-scope="scope">
            <span :style="{color: getSuccessRateColor(scope.row.success_count, scope.row.total_sent_count)}">
              {{ getSuccessRate(scope.row.success_count, scope.row.total_sent_count) }}%
            </span>
          </template>
        </el-table-column>

        <el-table-column label="发送统计" width="120" align="center">
          <template slot-scope="scope">
            <div class="send-stats">
              <div>总计：{{ scope.row.total_sent_count || 0 }}</div>
              <div>成功：{{ scope.row.success_count || 0 }}</div>
              <div>失败：{{ scope.row.failed_count || 0 }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleViewDetail(scope.row)">
              详情
            </el-button>
            <el-button type="text" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row)" style="color: #f56c6c;">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        />
      </div>
    </el-card>

    <!-- 编辑/新增广告弹窗 -->
    <el-dialog
      :title="editDialog.isEdit ? '编辑广告' : '新增广告'"
      :visible.sync="editDialog.visible"
      width="800px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editForm"
        label-width="120px"
      >
        <el-form-item label="广告标题" prop="title">
          <el-input
            v-model="editForm.title"
            placeholder="请输入广告标题"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="广告内容" prop="content">
          <el-input
            v-model="editForm.content"
            type="textarea"
            :rows="6"
            placeholder="请输入广告内容"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="广告图片" prop="image_url">
          <div class="image-upload-section">
            <el-upload
              class="image-uploader"
              :action="uploadConfig.action"
              :headers="uploadHeaders"
              :data="uploadData"
              :show-file-list="false"
              :before-upload="beforeImageUpload"
              :on-success="handleImageSuccess"
              :on-error="handleImageError"
              :on-progress="handleImageProgress"
            >
              <!-- 图片预览区域 -->
              <div v-if="editForm.image_url && !imageUploading" class="image-preview-container">
                <img :src="editForm.image_url" class="uploaded-image" alt="广告图片预览">
                <div class="image-overlay">
                  <i class="el-icon-view" @click.stop="handleImagePreview(editForm.image_url)"></i>
                  <i class="el-icon-edit"></i>
                </div>
              </div>

              <!-- 上传中状态 -->
              <div v-else-if="imageUploading" class="upload-progress">
                <el-progress type="circle" :percentage="uploadProgress" :width="100"></el-progress>
                <span>上传中...</span>
              </div>

              <!-- 未上传状态 -->
              <div v-else class="upload-placeholder">
                <i class="el-icon-plus image-uploader-icon"></i>
                <div class="upload-text">点击上传图片</div>
              </div>
            </el-upload>

            <div class="image-upload-tip">
              <p>支持 jpg、png、gif 格式，文件大小不超过 5MB</p>
              <p v-if="editForm.image_url" class="upload-success">✓ 图片上传成功</p>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="发送模式" prop="send_mode">
          <el-radio-group v-model="editForm.send_mode" @change="handleSendModeChange">
            <el-radio :label="1">一次性定时</el-radio>
            <el-radio :label="2">每日定时</el-radio>
            <el-radio :label="3">循环间隔</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 一次性定时模式 -->
        <el-form-item
          label="发送时间"
          prop="send_time"
          v-if="editForm.send_mode === 1"
        >
          <el-date-picker
            v-model="editForm.send_time"
            type="datetime"
            placeholder="选择发送时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%;"
          />
        </el-form-item>

        <!-- 每日定时模式 -->
        <div v-if="editForm.send_mode === 2">
          <el-form-item label="每日发送时间" prop="daily_times">
            <div class="daily-times-section">
              <div class="time-inputs">
                <el-time-picker
                  v-for="(time, index) in dailyTimesList"
                  :key="index"
                  v-model="dailyTimesList[index]"
                  placeholder="选择时间"
                  format="HH:mm"
                  value-format="HH:mm"
                  style="width: 120px; margin-right: 10px; margin-bottom: 10px;"
                />
              </div>
              <div class="time-actions">
                <el-button size="small" @click="addDailyTime" icon="el-icon-plus">添加时间</el-button>
                <el-button size="small" @click="removeDailyTime" icon="el-icon-minus" v-if="dailyTimesList.length > 1">移除时间</el-button>
              </div>
              <div class="time-tip">
                <p>可设置多个发送时间点，每天将在这些时间点发送广告</p>
              </div>
            </div>
          </el-form-item>
        </div>

        <!-- 循环间隔模式 -->
        <el-form-item
          label="发送间隔"
          prop="interval_minutes"
          v-if="editForm.send_mode === 3"
        >
          <div class="interval-section">
            <el-input-number
              v-model="editForm.interval_minutes"
              :min="1"
              :max="1440"
              placeholder="间隔分钟数"
              style="width: 200px;"
            />
            <span style="margin-left: 10px;">分钟</span>
            <div class="interval-tip">
              <p>设置发送间隔时间，范围：1-1440分钟（1天）</p>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="editDialog.loading">
          确定
        </el-button>
      </span>
    </el-dialog>

    <!-- 广告详情弹窗 -->
    <el-dialog
      title="广告详情"
      :visible.sync="detailDialog.visible"
      width="700px"
      :close-on-click-modal="false"
    >
      <div v-if="detailDialog.data" class="detail-content">
        <!-- 图片展示 -->
        <div class="detail-item" v-if="detailDialog.data.image_url">
          <label>广告图片：</label>
          <div class="detail-image-wrapper">
            <img
              :src="detailDialog.data.image_url"
              class="detail-image"
              alt="广告图片"
              @click="handleImagePreview(detailDialog.data.image_url)"
            />
          </div>
        </div>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <label>广告ID：</label>
              <span>{{ detailDialog.data.id }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>广告标题：</label>
              <span>{{ detailDialog.data.title }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <div class="detail-item">
              <label>广告内容：</label>
              <div class="content-text">{{ detailDialog.data.content }}</div>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <label>发送模式：</label>
              <el-tag :type="getSendModeType(detailDialog.data.send_mode)" size="small">
                {{ getSendModeText(detailDialog.data.send_mode) }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>状态：</label>
              <el-tag :type="getStatusType(detailDialog.data.status)" size="small">
                {{ getStatusText(detailDialog.data.status) }}
              </el-tag>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item" v-if="detailDialog.data.send_time">
              <label>发送时间：</label>
              <span>{{ detailDialog.data.send_time }}</span>
            </div>
            <div class="detail-item" v-if="detailDialog.data.daily_times">
              <label>每日时间：</label>
              <span>{{ detailDialog.data.daily_times }}</span>
            </div>
            <div class="detail-item" v-if="detailDialog.data.interval_minutes">
              <label>发送间隔：</label>
              <span>{{ detailDialog.data.interval_minutes }}分钟</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>生效期间：</label>
              <span>{{ detailDialog.data.start_date }} 至 {{ detailDialog.data.end_date || '永久' }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <label>发送统计：</label>
              <div class="send-stats-detail">
                <div>总计：{{ detailDialog.data.total_sent_count || 0 }}</div>
                <div>成功：{{ detailDialog.data.success_count || 0 }}</div>
                <div>失败：{{ detailDialog.data.failed_count || 0 }}</div>
                <div>成功率：{{ getSuccessRate(detailDialog.data.success_count, detailDialog.data.total_sent_count) }}%</div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>时间信息：</label>
              <div class="time-info">
                <div>创建时间：{{ detailDialog.data.created_at }}</div>
                <div>更新时间：{{ detailDialog.data.updated_at }}</div>
                <div v-if="detailDialog.data.last_sent_time">最后发送：{{ detailDialog.data.last_sent_time }}</div>
                <div v-if="detailDialog.data.next_send_time">下次发送：{{ detailDialog.data.next_send_time }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!-- 图片预览弹窗 -->
    <el-dialog
      title="图片预览"
      :visible.sync="imagePreviewDialog.visible"
      width="60%"
      :close-on-click-modal="true"
      append-to-body
    >
      <div class="image-preview-dialog">
        <img :src="imagePreviewDialog.url" alt="图片预览" class="preview-image" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAdvertisementListApi,
  getAdvertisementDetailApi,
  createAdvertisementApi,
  updateAdvertisementApi,
  deleteAdvertisementApi
} from '@/api/telegramApi'

import { uploadImageUrl } from '@/utils/config.js'

export default {
  name: 'AdvertisementList',
  data() {
    return {
      loading: false,

      // 搜索表单
      searchForm: {
        title: ''
      },

      // 广告列表数据
      advertisementList: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 20,

      // 编辑对话框
      editDialog: {
        visible: false,
        loading: false,
        isEdit: false
      },

      // 编辑表单
      editForm: {
        id: null,
        title: '',
        content: '',
        image_url: '',
        send_mode: 1,               // 发送模式：1=一次性定时, 2=每日定时, 3=循环间隔
        send_time: '',              // 发送时间（模式1使用）
        daily_times: '',            // 每日发送时间点（模式2使用）
        interval_minutes: 30,       // 发送间隔分钟数（模式3使用）
        start_date: '',             // 开始生效日期
        end_date: '',               // 结束生效日期
        status: 1                   // 状态：0=禁用, 1=启用
      },

      // 每日时间列表（用于界面显示）
      dailyTimesList: ['08:00'],

      // 表单验证规则
      editRules: {
        title: [
          { required: true, message: '请输入广告标题', trigger: 'blur' },
          { max: 200, message: '标题长度不能超过200个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入广告内容', trigger: 'blur' },
          { max: 1000, message: '内容长度不能超过1000个字符', trigger: 'blur' }
        ],
        image_url: [
          {
            validator: (rule, value, callback) => {
              if (!value || value.trim() === '') {
                callback(new Error('请上传广告图片'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        send_mode: [
          { required: true, message: '请选择发送模式', trigger: 'change' }
        ],
        send_time: [
          { required: true, message: '请选择发送时间', trigger: 'change' }
        ],
        daily_times: [
          { required: true, message: '请设置每日发送时间', trigger: 'change' }
        ],
        interval_minutes: [
          { required: true, message: '请设置发送间隔', trigger: 'change' },
          { type: 'number', min: 1, max: 1440, message: '间隔时间范围：1-1440分钟', trigger: 'change' }
        ]
      },

      // 详情对话框
      detailDialog: {
        visible: false,
        data: null
      },

      // 图片预览对话框
      imagePreviewDialog: {
        visible: false,
        url: ''
      },

      // 图片上传相关
      imageUploading: false,
      uploadProgress: 0,
      uploadConfig: {
        action: uploadImageUrl
      },
      uploadHeaders: {
        // 如果需要token，在这里设置
        // 'Authorization': 'Bearer ' + this.$store.getters.token
      },
      uploadData: {
        object: 'advertisement'  // 上传对象类型
      }
    }
  },

  mounted() {
    this.loadData()
  },

  methods: {
    // 加载数据
    async loadData() {
      this.loading = true
      try {
        const params = this.buildQueryParams()
        const res = await getAdvertisementListApi(params)

        if (res.code === 1) {
          this.advertisementList = res.data.list || []
          this.totalCount = parseInt(res.data.total) || 0
          this.currentPage = parseInt(res.data.current_page) || 1
          this.pageSize = parseInt(res.data.per_page) || 20
        } else {
          this.$message.error(res.message || '获取数据失败')
        }
      } catch (error) {
        console.error('加载数据失败:', error)
        this.$message.error('网络错误，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    // 构建查询参数
    buildQueryParams() {
      const params = {
        page: this.currentPage,
        limit: this.pageSize
      }

      // 添加搜索条件
      if (this.searchForm.title) params.title = this.searchForm.title

      return params
    },

    // 分页处理
    handleCurrentChange(page) {
      this.currentPage = page
      this.loadData()
    },

    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.loadData()
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.loadData()
    },

    // 重置
    handleReset() {
      this.searchForm = {
        title: ''
      }
      this.currentPage = 1
      this.loadData()
    },

    // 新增广告
    handleAdd() {
      this.editDialog.isEdit = false
      this.editForm = {
        id: null,
        title: '',
        content: '',
        image_url: '',
        send_mode: 1,
        send_time: '',
        daily_times: '',
        interval_minutes: 30,
        start_date: '',
        end_date: '',
        status: 1  // 默认启用
      }
      this.dailyTimesList = ['08:00']
      this.editDialog.visible = true
    },

    // 编辑广告
    async handleEdit(row) {
      try {
        const res = await getAdvertisementDetailApi({ id: row.id })
        if (res.code === 1) {
          this.editDialog.isEdit = true
          this.editForm = {
            id: res.data.id,
            title: res.data.title,
            content: res.data.content,
            image_url: res.data.image_url || '',
            send_mode: res.data.send_mode,
            send_time: res.data.send_time,
            daily_times: res.data.daily_times,
            interval_minutes: res.data.interval_minutes || 30,
            start_date: res.data.start_date,
            end_date: res.data.end_date,
            status: res.data.status
          }

          // 处理每日时间列表
          if (res.data.daily_times) {
            this.dailyTimesList = res.data.daily_times.split(',')
          } else {
            this.dailyTimesList = ['08:00']
          }

          this.editDialog.visible = true
        } else {
          this.$message.error(res.message || '获取广告详情失败')
        }
      } catch (error) {
        console.error('获取广告详情失败:', error)
        this.$message.error('网络错误，请稍后重试')
      }
    },

    // 删除广告
    handleDelete(row) {
      this.$confirm('确定要删除这个广告吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await deleteAdvertisementApi({ id: row.id })
          if (res.code === 1) {
            this.$message.success('删除成功')
            this.loadData()
          } else {
            this.$message.error(res.message || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('网络错误，请稍后重试')
        }
      })
    },

    // 查看详情
    async handleViewDetail(row) {
      try {
        const res = await getAdvertisementDetailApi({ id: row.id })
        if (res.code === 1) {
          this.detailDialog.data = res.data
          this.detailDialog.visible = true
        } else {
          this.$message.error(res.message || '获取详情失败')
        }
      } catch (error) {
        console.error('获取详情失败:', error)
        this.$message.error('网络错误，请稍后重试')
      }
    },

    // 发送模式改变处理
    handleSendModeChange(value) {
      // 所有模式都默认启用，清空日期范围
      this.editForm.status = 1
      this.editForm.start_date = ''
      this.editForm.end_date = ''

      // 清除其他模式的必填验证
      this.$nextTick(() => {
        if (this.$refs.editForm) {
          this.$refs.editForm.clearValidate()
        }
      })
    },

    // 添加每日时间
    addDailyTime() {
      this.dailyTimesList.push('08:00')
    },

    // 移除每日时间
    removeDailyTime() {
      if (this.dailyTimesList.length > 1) {
        this.dailyTimesList.pop()
      }
    },

    // 提交表单
    handleSubmit() {
      // 先检查图片是否已上传
      if (!this.editForm.image_url) {
        this.$message.error('请先上传广告图片')
        return
      }

      this.$refs.editForm.validate(async (valid) => {
        if (valid) {
          // 根据发送模式验证对应字段
          if (this.editForm.send_mode === 1 && !this.editForm.send_time) {
            this.$message.error('请选择发送时间')
            return
          }

          if (this.editForm.send_mode === 2) {
            // 过滤掉空的时间
            const validTimes = this.dailyTimesList.filter(time => time)
            if (validTimes.length === 0) {
              this.$message.error('请至少设置一个每日发送时间')
              return
            }
            this.editForm.daily_times = validTimes.join(',')
          }

          if (this.editForm.send_mode === 3 && (!this.editForm.interval_minutes || this.editForm.interval_minutes < 1)) {
            this.$message.error('请设置正确的发送间隔')
            return
          }

          this.editDialog.loading = true
          try {
            const data = { ...this.editForm }

            // 所有模式都默认启用，清空日期范围
            data.status = 1
            data.start_date = null
            data.end_date = null

            if (data.send_mode === 1) {
              // 一次性定时：清空其他模式字段
              data.daily_times = null
              data.interval_minutes = null
            } else if (data.send_mode === 2) {
              // 每日定时：清空其他模式字段
              data.send_time = null
              data.interval_minutes = null
            } else if (data.send_mode === 3) {
              // 循环间隔：清空其他模式字段
              data.send_time = null
              data.daily_times = null
            }

            let res
            if (this.editDialog.isEdit) {
              res = await updateAdvertisementApi(data)
            } else {
              delete data.id
              res = await createAdvertisementApi(data)
            }

            if (res.code === 1) {
              this.$message.success(this.editDialog.isEdit ? '编辑成功' : '新增成功')
              this.editDialog.visible = false
              this.loadData()
            } else {
              this.$message.error(res.message || '操作失败')
            }
          } catch (error) {
            console.error('操作失败:', error)
            this.$message.error('网络错误，请稍后重试')
          } finally {
            this.editDialog.loading = false
          }
        } else {
          this.$message.error('请检查表单填写是否完整')
        }
      })
    },

    // 对话框关闭处理
    handleDialogClose() {
      this.$refs.editForm && this.$refs.editForm.resetFields()
      this.imageUploading = false
      this.uploadProgress = 0
      this.dailyTimesList = ['08:00']
    },

    // 图片上传前的验证
    beforeImageUpload(file) {
      const isImage = file.type.indexOf('image/') === 0
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isImage) {
        this.$message.error('上传文件只能是图片格式!')
        return false
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return false
      }

      this.imageUploading = true
      this.uploadProgress = 0
      return true
    },

    // 图片上传成功
    handleImageSuccess(response, file) {
      this.imageUploading = false
      console.log('上传响应:', response)

      if (response.code === 1) {
        // 处理多种可能的响应格式
        let imageUrl = ''
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // 如果返回的是数组，取第一个元素
          imageUrl = response.data[0]
        } else if (response.data && response.data.url) {
          imageUrl = response.data.url
        } else if (response.data && typeof response.data === 'string') {
          imageUrl = response.data
        } else if (response.url) {
          imageUrl = response.url
        }

        if (imageUrl) {
          this.editForm.image_url = imageUrl
          this.$message.success('图片上传成功')

          // 手动触发表单验证，清除图片字段的错误状态
          this.$nextTick(() => {
            if (this.$refs.editForm) {
              this.$refs.editForm.validateField('image_url')
            }
          })
        } else {
          this.$message.error('图片上传成功，但获取图片地址失败')
          console.error('无法从响应中获取图片URL:', response)
        }
      } else {
        this.$message.error(response.message || '图片上传失败')
      }
    },

    // 图片上传失败
    handleImageError(error) {
      this.imageUploading = false
      this.$message.error('图片上传失败，请重试')
    },

    // 图片上传进度
    handleImageProgress(event) {
      this.uploadProgress = Math.round(event.percent)
    },

    // 图片预览
    handleImagePreview(url) {
      this.imagePreviewDialog.url = url
      this.imagePreviewDialog.visible = true
    },

    // 获取发送模式文本
    getSendModeText(mode) {
      const modeMap = {
        1: '一次性定时',
        2: '每日定时',
        3: '循环间隔'
      }
      return modeMap[mode] || '未知'
    },

    // 获取发送模式样式
    getSendModeType(mode) {
      const typeMap = {
        1: 'warning',
        2: 'success',
        3: 'info'
      }
      return typeMap[mode] || ''
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        0: '禁用',
        1: '启用',
        2: '已完成'
      }
      return statusMap[status] || '未知'
    },

    // 获取状态样式
    getStatusType(status) {
      const typeMap = {
        0: 'danger',
        1: 'success',
        2: 'info'
      }
      return typeMap[status] || ''
    },

    // 计算成功率
    getSuccessRate(successCount, totalCount) {
      if (!totalCount || totalCount === 0) return 0
      return Math.round((successCount / totalCount) * 100)
    },

    // 获取成功率颜色
    getSuccessRateColor(successCount, totalCount) {
      const rate = this.getSuccessRate(successCount, totalCount)
      if (rate >= 90) return '#67C23A'
      if (rate >= 70) return '#E6A23C'
      return '#F56C6C'
    }
  }
}
</script>

<style scoped>
.advertisement-list {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.search-card,
.action-card,
.table-card {
  margin-bottom: 20px;
}

.search-card .el-form {
  margin-bottom: 0;
}

.table-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}

.send-stats {
  font-size: 12px;
  line-height: 1.4;
}

.send-stats div {
  margin-bottom: 2px;
}

.pagination-wrapper {
  margin-top: 20px;
  text-align: right;
}

/* 图片上传组件样式 */
.image-upload-section {
  display: flex;
  flex-direction: column;
}

.image-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-uploader .el-upload:hover {
  border-color: #409EFF;
}

/* 图片预览容器 */
.image-preview-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 图片悬浮操作层 */
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-preview-container:hover .image-overlay {
  opacity: 1;
}

.image-overlay i {
  font-size: 20px;
  margin: 0 10px;
  cursor: pointer;
}

.image-overlay i:hover {
  color: #409EFF;
}

/* 上传占位符样式 */
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #8c939d;
}

.image-uploader-icon {
  font-size: 28px;
  margin-bottom: 10px;
}

.upload-text {
  font-size: 14px;
}

/* 上传进度样式 */
.upload-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.upload-progress span {
  margin-top: 10px;
  font-size: 12px;
  color: #409EFF;
}

.image-upload-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}

.upload-success {
  color: #67C23A !important;
  font-weight: bold;
}

.daily-times-section {
  width: 100%;
}

.time-inputs {
  margin-bottom: 10px;
}

.time-actions {
  margin-bottom: 10px;
}

.time-tip {
  font-size: 12px;
  color: #999;
}

.interval-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.interval-tip {
  width: 100%;
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}

.date-range-section {
  display: flex;
  align-items: center;
}

.date-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}

/* 详情弹窗样式 */
.detail-content {
  padding: 0;
}

.detail-item {
  margin-bottom: 15px;
}

.detail-item label {
  font-weight: bold;
  color: #333;
  margin-right: 10px;
  min-width: 80px;
  display: inline-block;
}

.detail-image-wrapper {
  margin-top: 10px;
}

.detail-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
  cursor: pointer;
}

.content-text {
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
}

.send-stats-detail {
  font-size: 14px;
  line-height: 1.6;
}

.time-info {
  font-size: 14px;
  line-height: 1.6;
}

/* 图片预览弹窗 */
.image-preview-dialog {
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}
</style>
