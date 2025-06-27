<template>
  <div class="red-packet-list">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>红包列表</h2>
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

        <el-form-item label="红包状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px;">
            <el-option label="进行中" value="1" />
            <el-option label="已抢完" value="2" />
            <el-option label="已过期" value="3" />
            <el-option label="已撤回" value="4" />
            <el-option label="已取消" value="5" />
          </el-select>
        </el-form-item>

        <el-form-item label="红包类型">
          <el-select v-model="searchForm.packet_type" placeholder="请选择类型" clearable style="width: 120px;">
            <el-option label="拼手气" value="1" />
            <el-option label="平均分配" value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="搜索">
          <el-input
            v-model="searchForm.keyword"
            placeholder="红包ID/标题"
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

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <el-table
        :data="redPacketList"
        v-loading="loading"
        stripe
        border
        style="width: 100%"
        :default-sort="{prop: 'created_at', order: 'descending'}"
      >
        <el-table-column prop="packet_id" label="红包ID" width="180" show-overflow-tooltip />

        <el-table-column prop="title" label="红包标题" min-width="150" show-overflow-tooltip />

        <el-table-column prop="total_amount" label="红包金额" width="120" align="right">
          <template slot-scope="scope">
            <span style="color: #f56c6c; font-weight: bold;">￥{{ scope.row.total_amount }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="total_count" label="红包个数" width="100" align="center" />

        <el-table-column prop="remain_count" label="剩余个数" width="100" align="center">
          <template slot-scope="scope">
            <span :style="{color: scope.row.remain_count > 0 ? '#67c23a' : '#909399'}">
              {{ scope.row.remain_count }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="packet_type_text" label="红包类型" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.packet_type == 1 ? 'warning' : 'success'" size="small">
              {{ scope.row.packet_type_text }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="sender_name" label="发送者" width="120" show-overflow-tooltip />

        <el-table-column prop="group_name" label="所属群组" width="150" show-overflow-tooltip />

        <el-table-column prop="status_text" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="getStatusType(scope.row.status)"
              size="small"
            >
              {{ scope.row.status_text }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="完成进度" width="150" align="center">
          <template slot-scope="scope">
            <el-progress
              :percentage="scope.row.progress"
              :stroke-width="8"
              :color="getProgressColor(scope.row.progress)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="创建时间" width="180" />

        <el-table-column prop="expire_time" label="过期时间" width="180" />

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

    <!-- 红包详情弹窗 -->
    <el-dialog
      title="红包详情"
      :visible.sync="detailDialog.visible"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-if="detailDialog.data" class="detail-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <label>红包ID：</label>
              <span>{{ detailDialog.data.packet_id }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>红包标题：</label>
              <span>{{ detailDialog.data.title }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <label>红包金额：</label>
              <span class="amount">￥{{ detailDialog.data.total_amount }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>红包个数：</label>
              <span>{{ detailDialog.data.total_count }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <label>剩余金额：</label>
              <span>￥{{ detailDialog.data.remain_amount }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>剩余个数：</label>
              <span>{{ detailDialog.data.remain_count }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <label>红包类型：</label>
              <el-tag :type="detailDialog.data.packet_type == 1 ? 'warning' : 'success'" size="small">
                {{ detailDialog.data.packet_type_text }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>红包状态：</label>
              <el-tag :type="getStatusType(detailDialog.data.status)" size="small">
                {{ detailDialog.data.status_text }}
              </el-tag>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <label>发送者：</label>
              <span>{{ detailDialog.data.sender_info && detailDialog.data.sender_info.user_name }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>所属群组：</label>
              <span>{{ detailDialog.data.group_info && detailDialog.data.group_info.title }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <label>创建时间：</label>
              <span>{{ detailDialog.data.created_at }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>过期时间：</label>
              <span>{{ detailDialog.data.expire_time }}</span>
            </div>
          </el-col>
        </el-row>

        <!-- 统计信息 -->
        <div class="stats-section">
          <h4>统计信息</h4>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-value">{{ detailDialog.data.stats && detailDialog.data.stats.grabbed_amount || 0 }}</div>
                <div class="stat-label">已抢金额</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-value">{{ detailDialog.data.stats && detailDialog.data.stats.grabbed_count || 0 }}</div>
                <div class="stat-label">已抢个数</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-value">{{ detailDialog.data.stats && detailDialog.data.stats.completion_rate || 0 }}%</div>
                <div class="stat-label">完成率</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-value">{{ detailDialog.data.stats && detailDialog.data.stats.avg_amount || 0 }}</div>
                <div class="stat-label">平均金额</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialog.visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRedPacketListApi,
  getRedPacketDetailApi
} from '@/api/telegramApi'

export default {
  name: 'RedPacketList',
  data() {
    return {
      loading: false,

      // 搜索表单
      searchForm: {
        dateRange: [],
        status: '',
        packet_type: '',
        keyword: ''
      },

      // 红包列表数据
      redPacketList: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 20,

      // 详情弹窗
      detailDialog: {
        visible: false,
        data: null
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
        const res = await getRedPacketListApi(params)

        if (res.code === 1) {
          this.redPacketList = res.data.data || []
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
      if (this.searchForm.packet_type) params.packet_type = this.searchForm.packet_type
      if (this.searchForm.keyword) {
        params.packet_id = this.searchForm.keyword
        params.title = this.searchForm.keyword
      }

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
        packet_type: '',
        keyword: ''
      }
      this.currentPage = 1
      this.loadData()
    },

    // 查看详情
    async handleViewDetail(row) {
      try {
        const res = await getRedPacketDetailApi({ id: row.id })
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

    // 获取状态类型
    getStatusType(status) {
      const statusMap = {
        1: 'success',  // 进行中
        2: 'info',     // 已抢完
        3: 'warning',  // 已过期
        4: 'danger',   // 已撤回
        5: 'info'      // 已取消
      }
      return statusMap[status] || 'info'
    },

    // 获取进度条颜色
    getProgressColor(percentage) {
      if (percentage < 30) return '#f56c6c'
      if (percentage < 70) return '#e6a23c'
      return '#67c23a'
    }
  }
}
</script>

<style scoped lang="scss">
.red-packet-list {
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

  .table-card {
    .pagination-wrapper {
      margin-top: 20px;
      text-align: right;
    }
  }

  .detail-content {
    .detail-item {
      margin-bottom: 15px;

      label {
        font-weight: bold;
        color: #606266;
      }

      .amount {
        color: #f56c6c;
        font-weight: bold;
        font-size: 16px;
      }
    }

    .stats-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ebeef5;

      h4 {
        margin-bottom: 15px;
        color: #303133;
      }

      .stat-item {
        text-align: center;
        padding: 15px;
        background: #f5f7fa;
        border-radius: 4px;

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #409eff;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
}
</style>
