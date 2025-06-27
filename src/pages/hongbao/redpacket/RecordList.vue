<template>
  <div class="record-list">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>红包领取记录</h2>
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

        <el-form-item label="用户搜索">
          <el-input
            v-model="searchForm.userKeyword"
            placeholder="用户名/TG_ID"
            style="width: 200px;"
            clearable
          />
        </el-form-item>

        <el-form-item label="金额范围">
          <el-input
            v-model="searchForm.min_amount"
            placeholder="最小金额"
            style="width: 100px;"
            clearable
          />
          <span style="margin: 0 8px;">-</span>
          <el-input
            v-model="searchForm.max_amount"
            placeholder="最大金额"
            style="width: 100px;"
            clearable
          />
        </el-form-item>

        <el-form-item label="手气最佳">
          <el-select v-model="searchForm.is_best" placeholder="请选择" clearable style="width: 100px;">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="红包ID">
          <el-input
            v-model="searchForm.packet_id"
            placeholder="红包ID"
            style="width: 150px;"
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
        :data="recordList"
        v-loading="loading"
        stripe
        border
        style="width: 100%"
        :default-sort="{prop: 'grab_time', order: 'descending'}"
      >
        <el-table-column prop="packet_id" label="红包ID" width="180" show-overflow-tooltip />

        <el-table-column prop="red_packet_title" label="红包标题" min-width="150" show-overflow-tooltip />

        <el-table-column prop="username" label="领取用户" width="150" show-overflow-tooltip />

        <el-table-column prop="amount" label="领取金额" width="120" align="right">
          <template slot-scope="scope">
            <span style="color: #f56c6c; font-weight: bold; font-size: 16px;">
              ￥{{ scope.row.amount }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="grab_order" label="领取顺序" width="100" align="center">
          <template slot-scope="scope">
            <el-tag size="small" type="info">第{{ scope.row.grab_order }}个</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="is_best_text" label="手气最佳" width="100" align="center" />

        <el-table-column prop="group_name" label="所属群组" width="150" show-overflow-tooltip />

        <el-table-column prop="sender_name" label="发包用户" width="120" show-overflow-tooltip />

        <el-table-column prop="created_at_format" label="领取时间" width="180" />

        <el-table-column label="操作" width="80" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleViewDetail(scope.row)"
            >
              详情
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

    <!-- 记录详情弹窗 -->
    <el-dialog
      title="领取记录详情"
      :visible.sync="detailDialog.visible"
      width="600px"
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
              <span>{{ detailDialog.data.packet_title }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <label>领取用户：</label>
              <span>{{ detailDialog.data.username }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>用户TG_ID：</label>
              <span>{{ detailDialog.data.user_tg_id }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <label>领取金额：</label>
              <span class="amount">￥{{ detailDialog.data.amount }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>领取顺序：</label>
              <span>第{{ detailDialog.data.grab_order }}个</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <label>手气最佳：</label>
              <el-tag
                v-if="detailDialog.data.is_best == 1"
                size="small"
                type="warning"
                style="background: linear-gradient(45deg, #ffd700, #ffed4a); color: #8b4513; border: none;"
              >
                <i class="el-icon-trophy"></i> 是
              </el-tag>
              <span v-else>否</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>领取时间：</label>
              <span>{{ detailDialog.data.grab_time }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <label>所属群组：</label>
              <span>{{ detailDialog.data.group_name }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <label>发包用户：</label>
              <span>{{ detailDialog.data.sender_name }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialog.visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRedPacketRecordsApi
} from '@/api/telegramApi'

export default {
  name: 'RecordList',
  data() {
    return {
      loading: false,

      // 搜索表单
      searchForm: {
        dateRange: [],
        userKeyword: '',
        min_amount: '',
        max_amount: '',
        is_best: '',
        packet_id: ''
      },

      // 记录列表数据
      recordList: [],
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
        const res = await getRedPacketRecordsApi(params)

        if (res.code === 1) {
          this.recordList = res.data.data || []
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
      if (this.searchForm.userKeyword) {
        params.user_tg_id = this.searchForm.userKeyword
        params.username = this.searchForm.userKeyword
      }
      if (this.searchForm.min_amount) params.min_amount = this.searchForm.min_amount
      if (this.searchForm.max_amount) params.max_amount = this.searchForm.max_amount
      if (this.searchForm.is_best !== '') params.is_best = this.searchForm.is_best
      if (this.searchForm.packet_id) params.packet_id = this.searchForm.packet_id

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
        userKeyword: '',
        min_amount: '',
        max_amount: '',
        is_best: '',
        packet_id: ''
      }
      this.currentPage = 1
      this.loadData()
    },

    // 查看详情 - 直接使用列表数据
    handleViewDetail(row) {
      this.detailDialog.data = row
      this.detailDialog.visible = true
    }
  }
}
</script>

<style scoped lang="scss">
.record-list {
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
  }
}
</style>
