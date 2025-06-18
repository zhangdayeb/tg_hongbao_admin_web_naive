<template>
  <div class="advertisement-list">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>广告管理</h2>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline size="small">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 350px;"
          />
        </el-form-item>

        <el-form-item label="广告状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px;">
            <el-option label="草稿" value="draft" />
            <el-option label="活跃" value="active" />
            <el-option label="完成" value="completed" />
            <el-option label="取消" value="cancelled" />
          </el-select>
        </el-form-item>

        <el-form-item label="发送模式">
          <el-select v-model="searchForm.send_mode" placeholder="请选择模式" clearable style="width: 120px;">
            <el-option label="立即发送" value="immediate" />
            <el-option label="定时发送" value="scheduled" />
            <el-option label="循环发送" value="recurring" />
          </el-select>
        </el-form-item>

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
        border
        style="width: 100%"
        :default-sort="{prop: 'created_at', order: 'descending'}"
      >
        <el-table-column prop="id" label="广告ID" width="80" align="center" />

        <!-- 新增图片列 -->
        <el-table-column label="广告图片" width="120" align="center">
          <template slot-scope="scope">
            <div class="image-preview">
              <img
                v-if="scope.row.image_url"
                :src="scope.row.image_url"
                alt="广告图片"
                class="table-image"
                @click="handleImagePreview(scope.row.image_url)"
              />
              <div v-else class="no-image">
                <i class="el-icon-picture-outline"></i>
                <span>暂无图片</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="title" label="广告标题" min-width="150" show-overflow-tooltip />

        <el-table-column prop="content" label="广告内容" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.content.length > 50 ? scope.row.content.substring(0, 50) + '...' : scope.row.content }}
          </template>
        </el-table-column>

        <el-table-column label="发送模式" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="getSendModeType(scope.row.send_mode)" size="small">
              {{ scope.row.send_mode_text || getSendModeText(scope.row.send_mode) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ scope.row.status_text || getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="成功率" width="100" align="center">
          <template slot-scope="scope">
            <span :style="{color: getSuccessRateColor(scope.row.success_rate || 0)}">
              {{ (scope.row.success_rate || 0) }}%
            </span>
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
          <el-input v-model="editForm.title" placeholder="请输入广告标题" />
        </el-form-item>

        <!-- 图片上传组件 -->
        <el-form-item label="广告图片" prop="image_url">
          <el-upload
            class="image-uploader"
            :action="uploadConfig.action"
            :headers="uploadHeaders"
            :data="uploadData"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :on-error="handleImageError"
            :before-upload="beforeImageUpload"
            :on-progress="handleImageProgress"
            accept="image/*"
            drag
          >
            <div v-if="editForm.image_url && !imageUploading" class="image-preview-wrapper">
              <img :src="editForm.image_url" class="upload-image" alt="广告图片">
              <div class="image-overlay">
                <i class="el-icon-edit-outline"></i>
                <span>点击或拖拽替换图片</span>
              </div>
            </div>
            <div v-else-if="imageUploading" class="uploading-wrapper">
              <el-progress
                type="circle"
                :percentage="uploadProgress"
                :width="80"
              />
              <p>上传中...</p>
            </div>
            <div v-else class="upload-placeholder">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将图片拖到此处，或<em>点击上传</em>
              </div>
              <div class="el-upload__tip">
                支持 jpg、png、gif 格式，文件大小不超过 5MB
              </div>
            </div>
          </el-upload>

          <!-- 调试信息 (开发时可见，生产环境可删除) -->
          <div v-if="editForm.image_url" style="margin-top: 10px; font-size: 12px; color: #909399;">
            图片地址: {{ editForm.image_url }}
          </div>
        </el-form-item>

        <el-form-item label="广告内容" prop="content">
          <el-input
            v-model="editForm.content"
            type="textarea"
            :rows="6"
            placeholder="请输入广告内容"
          />
        </el-form-item>

        <el-form-item label="发送模式" prop="send_mode">
          <el-radio-group v-model="editForm.send_mode">
            <el-radio label="immediate">立即发送</el-radio>
            <el-radio label="scheduled">定时发送</el-radio>
            <el-radio label="recurring">循环发送</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="发送时间"
          prop="send_time"
          v-if="editForm.send_mode === 'scheduled'"
        >
          <el-date-picker
            v-model="editForm.send_time"
            type="datetime"
            placeholder="选择发送时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>

        <div v-if="editForm.send_mode === 'recurring'">
          <el-form-item label="循环模式" prop="recurrence_pattern">
            <el-select v-model="editForm.recurrence_pattern" placeholder="请选择循环模式">
              <el-option label="每日" value="daily" />
              <el-option label="每周" value="weekly" />
              <el-option label="每月" value="monthly" />
            </el-select>
          </el-form-item>

          <el-form-item label="开始日期" prop="start_date">
            <el-date-picker
              v-model="editForm.start_date"
              type="date"
              placeholder="选择开始日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>

          <el-form-item label="结束日期">
            <el-date-picker
              v-model="editForm.end_date"
              type="date"
              placeholder="选择结束日期(可选)"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </div>
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
      width="600px"
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
                {{ detailDialog.data.send_mode_text || getSendModeText(detailDialog.data.send_mode) }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>状态：</label>
              <el-tag :type="getStatusType(detailDialog.data.status)" size="small">
                {{ detailDialog.data.status_text || getStatusText(detailDialog.data.status) }}
              </el-tag>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" v-if="detailDialog.data.send_time">
          <el-col :span="12">
            <div class="detail-item">
              <label>发送时间：</label>
              <span>{{ detailDialog.data.send_time }}</span>
            </div>
          </el-col>
          <el-col :span="12" v-if="detailDialog.data.recurrence_pattern">
            <div class="detail-item">
              <label>循环模式：</label>
              <span>{{ getRecurrenceText(detailDialog.data.recurrence_pattern) }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" v-if="detailDialog.data.success_rate !== undefined">
          <el-col :span="12">
            <div class="detail-item">
              <label>成功率：</label>
              <span :style="{color: getSuccessRateColor(detailDialog.data.success_rate)}">
                {{ detailDialog.data.success_rate }}%
              </span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>创建时间：</label>
              <span>{{ detailDialog.data.created_at }}</span>
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
        dateRange: [],
        status: '',
        send_mode: '',
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
        image_url: '',           // 新增：图片地址
        image_file: null,        // 新增：待上传的图片文件
        send_mode: 'immediate',
        send_time: '',
        recurrence_pattern: '',
        start_date: '',
        end_date: ''
      },

      // 表单验证规则
      editRules: {
        title: [
          { required: true, message: '请输入广告标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入广告内容', trigger: 'blur' }
        ],
        image_url: [
          { required: true, message: '请上传广告图片', trigger: 'change' }
        ],
        send_mode: [
          { required: true, message: '请选择发送模式', trigger: 'change' }
        ],
        send_time: [
          { required: true, message: '请选择发送时间', trigger: 'change' }
        ],
        recurrence_pattern: [
          { required: true, message: '请选择循环模式', trigger: 'change' }
        ],
        start_date: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
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
      if (this.searchForm.status) params.status = this.searchForm.status
      if (this.searchForm.send_mode) params.send_mode = this.searchForm.send_mode
      if (this.searchForm.title) params.title = this.searchForm.title

      // 处理时间范围
      if (this.searchForm.dateRange && this.searchForm.dateRange.length === 2) {
        params.start_date = this.searchForm.dateRange[0].split(' ')[0]
        params.end_date = this.searchForm.dateRange[1].split(' ')[0]
      }

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
        dateRange: [],
        status: '',
        send_mode: '',
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
        image_file: null,
        send_mode: 'immediate',
        send_time: '',
        recurrence_pattern: '',
        start_date: '',
        end_date: ''
      }
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
            image_file: null,
            send_mode: res.data.send_mode,
            send_time: res.data.send_time,
            recurrence_pattern: res.data.recurrence_pattern,
            start_date: res.data.start_date,
            end_date: res.data.end_date
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

    // 提交表单
    handleSubmit() {
      this.$refs.editForm.validate(async (valid) => {
        if (valid) {
          this.editDialog.loading = true
          try {
            const data = { ...this.editForm }
            // 移除不需要提交的字段
            delete data.image_file

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
        }
      })
    },

    // 对话框关闭处理
    handleDialogClose() {
      this.$refs.editForm && this.$refs.editForm.resetFields()
      this.imageUploading = false
      this.uploadProgress = 0
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

      // 根据实际响应结构调整
      if (response.code === 1) {
        // 处理多种可能的响应格式
        let imageUrl = ''
        if (response.data && response.data.url) {
          imageUrl = response.data.url
        } else if (response.data && typeof response.data === 'string') {
          imageUrl = response.data
        } else if (response.url) {
          imageUrl = response.url
        } else if (typeof response.data === 'object' && response.data.length > 0) {
          imageUrl = response.data[0] // 如果返回的是数组
        }

        if (imageUrl) {
          this.editForm.image_url = imageUrl
          this.editForm.image_file = file
          this.$message.success('图片上传成功')

          // 手动触发表单验证
          this.$refs.editForm.validateField('image_url')
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
      console.error('上传失败:', error)
    },

    // 图片上传进度
    handleImageProgress(event, file, fileList) {
      this.uploadProgress = Math.round(event.percent) || 0
    },

    // 图片预览
    handleImagePreview(imageUrl) {
      this.imagePreviewDialog.url = imageUrl
      this.imagePreviewDialog.visible = true
    },

    // 获取发送模式类型
    getSendModeType(mode) {
      const modeMap = {
        immediate: 'success',
        scheduled: 'warning',
        recurring: 'info'
      }
      return modeMap[mode] || 'info'
    },

    // 获取发送模式文本
    getSendModeText(mode) {
      const modeMap = {
        immediate: '立即发送',
        scheduled: '定时发送',
        recurring: '循环发送'
      }
      return modeMap[mode] || mode
    },

    // 获取状态类型
    getStatusType(status) {
      const statusMap = {
        draft: 'info',
        active: 'success',
        completed: 'warning',
        cancelled: 'danger'
      }
      return statusMap[status] || 'info'
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        draft: '草稿',
        active: '活跃',
        completed: '完成',
        cancelled: '取消'
      }
      return statusMap[status] || status
    },

    // 获取成功率颜色
    getSuccessRateColor(rate) {
      if (rate >= 80) return '#67c23a'
      if (rate >= 60) return '#e6a23c'
      return '#f56c6c'
    },

    // 获取循环模式文本
    getRecurrenceText(pattern) {
      const patternMap = {
        daily: '每日',
        weekly: '每周',
        monthly: '每月'
      }
      return patternMap[pattern] || '-'
    }
  }
}
</script>

<style scoped lang="scss">
.advertisement-list {
  padding: 20px;

  .page-header {
    margin-bottom: 20px;

    h2 {
      margin: 0;
      color: #303133;
    }
  }

  .search-card {
    margin-bottom: 20px;

    .el-form {
      margin-bottom: 0;
    }
  }

  .action-card {
    margin-bottom: 20px;
  }

  .table-card {
    .pagination-wrapper {
      margin-top: 20px;
      text-align: right;
    }

    // 表格中的图片预览
    .image-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 80px;

      .table-image {
        max-width: 80px;
        max-height: 60px;
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.2s;

        &:hover {
          transform: scale(1.1);
        }
      }

      .no-image {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #C0C4CC;
        font-size: 12px;

        i {
          font-size: 24px;
          margin-bottom: 4px;
        }
      }
    }
  }

  // 图片上传组件样式
  .image-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: border-color 0.2s;

      &:hover {
        border-color: #409EFF;
      }
    }

    .image-preview-wrapper {
      position: relative;
      width: 200px;
      height: 150px;

      .upload-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;

        &:hover {
          opacity: 1;
        }

        i {
          font-size: 20px;
          margin-bottom: 8px;
        }

        span {
          font-size: 12px;
        }
      }
    }

    .uploading-wrapper {
      width: 200px;
      height: 150px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      p {
        margin-top: 15px;
        color: #606266;
      }
    }

    .upload-placeholder {
      width: 200px;
      height: 150px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #606266;

      i {
        font-size: 28px;
        color: #C0C4CC;
        margin-bottom: 16px;
      }

      .el-upload__text {
        color: #606266;
        font-size: 14px;
        text-align: center;

        em {
          color: #409EFF;
          font-style: normal;
        }
      }

      .el-upload__tip {
        font-size: 12px;
        color: #C0C4CC;
        margin-top: 7px;
        text-align: center;
      }
    }
  }

  // 详情对话框样式
  .detail-content {
    .detail-item {
      margin-bottom: 15px;

      label {
        font-weight: bold;
        color: #606266;
      }

      .content-text {
        margin-top: 8px;
        padding: 10px;
        background: #f5f7fa;
        border-radius: 4px;
        line-height: 1.6;
        white-space: pre-wrap;
      }
    }

    .detail-image-wrapper {
      margin-top: 8px;

      .detail-image {
        max-width: 300px;
        max-height: 200px;
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.2s;

        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }

  // 图片预览对话框
  .image-preview-dialog {
    text-align: center;

    .preview-image {
      max-width: 100%;
      max-height: 70vh;
      border-radius: 4px;
    }
  }
}
</style>
