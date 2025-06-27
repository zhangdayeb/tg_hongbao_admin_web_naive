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

        <!-- 新增发送目标列 -->
        <el-table-column label="发送目标" width="120" align="center">
          <template slot-scope="scope">
            <div style="font-size: 12px;">
              <div v-if="scope.row.is_crowd == 1">
                <el-tag type="success" size="mini">群发</el-tag>
              </div>
              <div v-if="scope.row.is_all_member == 1" style="margin-top: 2px;">
                <el-tag type="info" size="mini">私发</el-tag>
              </div>
              <div v-if="scope.row.is_crowd != 1 && scope.row.is_all_member != 1">
                <el-tag type="warning" size="mini">未设置</el-tag>
              </div>
            </div>
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
              间隔：{{ scope.row.interval_minutes || '-' }}分钟
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="发送统计" width="120" align="center">
          <template slot-scope="scope">
            <div style="font-size: 12px;">
              <div>总计：{{ scope.row.total_sent_count || 0 }}</div>
              <div :style="{ color: getSuccessRateColor(scope.row.success_count, scope.row.total_sent_count) }">
                成功率：{{ getSuccessRate(scope.row.success_count, scope.row.total_sent_count) }}%
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.created_at }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleViewDetail(scope.row)">详情</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div style="margin-top: 20px; text-align: center;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        />
      </div>
    </el-card>

    <!-- 编辑/新增对话框 -->
    <el-dialog
      :title="editDialog.isEdit ? '编辑广告' : '新增广告'"
      :visible.sync="editDialog.visible"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="currentRules"
        label-width="120px"
        style="padding-right: 30px;"
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
            type="textarea"
            v-model="editForm.content"
            placeholder="请输入广告内容"
            :rows="4"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="广告图片" prop="image_url">
          <div class="image-upload-container">
            <!-- 图片上传区域 -->
            <el-upload
              ref="imageUpload"
              :action="uploadConfig.action"
              :data="uploadData"
              :headers="uploadHeaders"
              :before-upload="handleBeforeUpload"
              :on-progress="handleUploadProgress"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :show-file-list="false"
              accept="image/*"
              class="image-uploader"
            >
              <div class="upload-area">
                <i class="el-icon-plus" v-if="!editForm.image_url && !imageUploading"></i>
                <div class="upload-progress" v-if="imageUploading">
                  <i class="el-icon-loading"></i>
                  <span>上传中 {{ uploadProgress }}%</span>
                </div>
                <img v-if="editForm.image_url && !imageUploading" :src="editForm.image_url" class="uploaded-image">
              </div>
            </el-upload>

            <!-- 上传提示和状态 -->
            <div class="upload-info">
              <p class="image-upload-tip">支持 jpg、png、gif 格式，文件大小不超过 5MB</p>
              <p v-if="editForm.image_url && !imageUploading" class="upload-success">✓ 图片上传成功</p>
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

        <!-- 新增发送目标配置 -->
        <el-form-item label="发送目标" prop="send_target">
          <div class="send-target-section">
            <div class="target-switches">
              <el-switch
                v-model="editForm.is_crowd"
                :active-value="1"
                :inactive-value="0"
                active-text="群组发送"
                inactive-text=""
                style="margin-right: 30px;"
              />
              <el-switch
                v-model="editForm.is_all_member"
                :active-value="1"
                :inactive-value="0"
                active-text="私信发送"
                inactive-text=""
              />
            </div>
            <div class="target-tip">
              <p style="color: #999; font-size: 12px; margin-top: 10px;">
                可以同时选择群组发送和私信发送，至少选择一种发送方式
              </p>
              <p v-if="!isValidSendTarget" style="color: #f56c6c; font-size: 12px; margin-top: 5px;">
                请至少选择一种发送方式
              </p>
            </div>
          </div>
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
          <el-form-item label="每日发送时间">
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
                  @change="updateDailyTimes"
                />
              </div>
              <div class="time-actions">
                <el-button size="small" @click="addDailyTime" icon="el-icon-plus">添加时间</el-button>
                <el-button size="small" @click="removeDailyTime" icon="el-icon-minus" v-if="dailyTimesList.length > 1">移除时间</el-button>
              </div>
              <div class="time-tip">
                <p>可设置多个发送时间点，每天将在这些时间点发送广告</p>
                <p style="color: #f56c6c;" v-if="!isValidDailyTimes">请至少设置一个每日发送时间</p>
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
              <p>设置广告发送的时间间隔，单位为分钟（1-1440分钟）</p>
            </div>
          </div>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="editDialog.loading">确定</el-button>
      </div>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      title="广告详情"
      :visible.sync="detailDialog.visible"
      width="700px"
      append-to-body
    >
      <div class="detail-content" v-if="detailDialog.data">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <label>标题：</label>
              <span>{{ detailDialog.data.title }}</span>
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
          <el-col :span="24">
            <div class="detail-item">
              <label>内容：</label>
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
              <label>发送目标：</label>
              <div>
                <el-tag v-if="detailDialog.data.is_crowd == 1" type="success" size="small" style="margin-right: 8px;">群组发送</el-tag>
                <el-tag v-if="detailDialog.data.is_all_member == 1" type="info" size="small">私信发送</el-tag>
                <span v-if="detailDialog.data.is_crowd != 1 && detailDialog.data.is_all_member != 1" style="color: #999;">未设置</span>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item" v-if="detailDialog.data.image_url">
              <label>广告图片：</label>
              <div class="detail-image-wrapper">
                <img
                  :src="detailDialog.data.image_url"
                  class="detail-image"
                  @click="handleImagePreview(detailDialog.data.image_url)"
                />
              </div>
            </div>
          </el-col>
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
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <label>生效期间：</label>
              <span>{{ detailDialog.data.start_date }} 至 {{ detailDialog.data.end_date || '永久' }}</span>
            </div>
          </el-col>
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
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
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
        status: 1,                  // 状态：0=禁用, 1=启用
        is_crowd: 1,                // 是否群发：0=否, 1=是
        is_all_member: 1            // 是否全体私发：0=否, 1=是
      },

      // 每日时间列表（用于界面显示）
      dailyTimesList: ['08:00'],

      // 基础表单验证规则
      baseRules: {
        title: [
          { required: true, message: '请输入广告标题', trigger: 'blur' },
          { max: 200, message: '标题长度不能超过200个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入广告内容', trigger: 'blur' },
          { max: 1000, message: '内容长度不能超过1000个字符', trigger: 'blur' }
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
        interval_minutes: [
          { required: true, message: '请设置发送间隔', trigger: 'change' },
          { type: 'number', min: 1, max: 1440, message: '间隔时间范围：1-1440分钟', trigger: 'change' }
        ],
        send_target: [
          { validator: this.validateSendTarget, trigger: 'change' }
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

  computed: {
    // 检查每日时间设置是否有效
    isValidDailyTimes() {
      if (this.editForm.send_mode !== 2) return true
      const validTimes = this.dailyTimesList.filter(time => time && time.trim() !== '')
      return validTimes.length > 0
    },

    // 检查发送目标设置是否有效
    isValidSendTarget() {
      return this.editForm.is_crowd === 1 || this.editForm.is_all_member === 1
    },

    // 动态计算当前需要的验证规则
    currentRules() {
      const rules = { ...this.baseRules }

      // 根据发送模式调整验证规则
      if (this.editForm.send_mode === 1) {
        // 一次性定时：需要发送时间
        rules.send_time = [
          { required: true, message: '请选择发送时间', trigger: 'change' }
        ]
      } else if (this.editForm.send_mode === 2) {
        // 每日定时：不需要 send_time 验证
        delete rules.send_time
      } else if (this.editForm.send_mode === 3) {
        // 循环间隔：需要间隔时间
        rules.interval_minutes = [
          { required: true, message: '请设置发送间隔', trigger: 'change' },
          { type: 'number', min: 1, max: 1440, message: '间隔时间范围：1-1440分钟', trigger: 'change' }
        ]
        delete rules.send_time
      }

      return rules
    }
  },

  mounted() {
    this.loadData()
  },

  methods: {
    // 发送目标验证器
    validateSendTarget(rule, value, callback) {
      if (!this.isValidSendTarget) {
        callback(new Error('请至少选择一种发送方式'))
      } else {
        callback()
      }
    },

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
        status: 1,          // 默认启用
        is_crowd: 1,        // 默认开启群发
        is_all_member: 1    // 默认开启私发
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
            status: res.data.status,
            is_crowd: res.data.is_crowd,
            is_all_member: res.data.is_all_member
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
      this.updateDailyTimes()
    },

    // 移除每日时间
    removeDailyTime() {
      if (this.dailyTimesList.length > 1) {
        this.dailyTimesList.pop()
        this.updateDailyTimes()
      }
    },

    // 更新每日时间到表单
    updateDailyTimes() {
      if (this.editForm.send_mode === 2) {
        const validTimes = this.dailyTimesList.filter(time => time && time.trim() !== '')
        this.editForm.daily_times = validTimes.join(',')
      }
    },

    // 提交表单
    handleSubmit() {
      // 每日定时模式的特殊验证
      if (this.editForm.send_mode === 2) {
        if (!this.isValidDailyTimes) {
          this.$message.error('请至少设置一个每日发送时间')
          return
        }
        this.updateDailyTimes()
      }

      // 发送目标验证
      if (!this.isValidSendTarget) {
        this.$message.error('请至少选择一种发送方式')
        return
      }

      this.$refs.editForm.validate(async (valid) => {
        if (valid) {
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
              this.$message.success(this.editDialog.isEdit ? '更新成功' : '创建成功')
              this.editDialog.visible = false
              this.loadData()
            } else {
              this.$message.error(res.message || '操作失败')
            }
          } catch (error) {
            console.error('提交失败:', error)
            this.$message.error('网络错误，请稍后重试')
          } finally {
            this.editDialog.loading = false
          }
        }
      })
    },

    // 图片上传相关方法
    handleBeforeUpload(file) {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isValidType) {
        this.$message.error('只能上传 JPG/PNG/GIF 格式的图片!')
        return false
      }
      if (!isLt5M) {
        this.$message.error('图片大小不能超过 5MB!')
        return false
      }

      this.imageUploading = true
      this.uploadProgress = 0
      return true
    },

    handleUploadProgress(event) {
      this.uploadProgress = Math.round(event.percent)
    },

    handleUploadSuccess(response) {
      this.imageUploading = false
      this.uploadProgress = 0

      if (response.code === 1) {
        // 处理返回的数据格式，data是数组，取第一个元素作为图片URL
        this.editForm.image_url = Array.isArray(response.data) ? response.data[0] : response.data.url || response.data
        this.$message.success('图片上传成功')
        // 触发表单验证，清除图片字段的错误状态
        this.$nextTick(() => {
          if (this.$refs.editForm) {
            this.$refs.editForm.validateField('image_url')
          }
        })
      } else {
        this.$message.error(response.message || '图片上传失败')
      }
    },

    handleUploadError(error) {
      this.imageUploading = false
      this.uploadProgress = 0
      console.error('图片上传失败:', error)
      this.$message.error('图片上传失败，请稍后重试')
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
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}

.table-image:hover {
  opacity: 0.8;
}

/* 图片上传样式 */
.image-upload-container {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.image-uploader:hover {
  border-color: #409EFF;
}

.upload-area {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fbfdff;
}

.upload-area .el-icon-plus {
  font-size: 28px;
  color: #8c939d;
}

.uploaded-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  display: block;
}

.upload-info {
  flex: 1;
}

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

/* 发送目标样式 */
.send-target-section {
  width: 100%;
}

.target-switches {
  margin-bottom: 10px;
}

.target-tip {
  margin-top: 10px;
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
  max-width: 150px;
  max-height: 150px;
  border-radius: 4px;
  cursor: pointer;
}

.detail-image:hover {
  opacity: 0.8;
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
