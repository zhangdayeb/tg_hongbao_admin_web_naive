<template>
  <div class='page-content'>
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="8" :md="6" :lg="4">
          <el-input placeholder="用户账号" v-model="searchParameter.user_name" clearable></el-input>
        </el-col>
        <el-col :xs="24" :sm="8" :md="6" :lg="4">
          <el-select v-model="searchParameter.status" placeholder="状态筛选" clearable style="width: 100%">
            <el-option label="待审核" value="0"></el-option>
            <el-option label="已通过" value="1"></el-option>
            <el-option label="已拒绝" value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="8" :md="6" :lg="4">
          <el-input placeholder="提现地址" v-model="searchParameter.withdraw_address" clearable></el-input>
        </el-col>
        <el-col :xs="24" :sm="8" :md="6" :lg="4">
          <el-date-picker
            v-model="searchParameter.dateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 100%">
          </el-date-picker>
        </el-col>
        <el-col :xs="24" :sm="8" :md="6" :lg="4">
          <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
          <el-button @click="resetSearch" icon="el-icon-refresh">重置</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 统计信息 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-item">
            <div class="stats-value">{{statistics.today_count || 0}}</div>
            <div class="stats-label">今日提现笔数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-item">
            <div class="stats-value">¥{{statistics.today_amount || 0}}</div>
            <div class="stats-label">今日提现金额</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-item">
            <div class="stats-value">{{statistics.pending_count || 0}}</div>
            <div class="stats-label">待审核订单</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-item">
            <div class="stats-value">¥{{statistics.pending_amount || 0}}</div>
            <div class="stats-label">待审核金额</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <div slot="header" class="card-header">
        <span>提现记录</span>
        <div class="header-actions">
          <el-button type="success" size="small" @click="exportData" icon="el-icon-download">导出</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="withdrawList"
        border
        stripe
        style="width: 100%"
        :default-sort="{prop: 'create_time', order: 'descending'}">

        <el-table-column label="订单号" prop="order_number" width="180" fixed="left">
          <template slot-scope="scope">
            <el-button type="text" @click="showDetail(scope.row)">
              {{scope.row.order_number}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="用户账号" prop="user_name" width="120">
          <template slot-scope="scope">
            <span class="user-name">{{scope.row.user_name}}</span>
          </template>
        </el-table-column>

        <el-table-column label="提现金额" prop="money" width="120" sortable>
          <template slot-scope="scope">
            <span class="money-amount">¥{{scope.row.money}}</span>
          </template>
        </el-table-column>

        <el-table-column label="手续费" prop="money_fee" width="100">
          <template slot-scope="scope">
            <span class="fee-amount">¥{{scope.row.money_fee}}</span>
          </template>
        </el-table-column>

        <el-table-column label="实际到账" prop="money_actual" width="120">
          <template slot-scope="scope">
            <span class="actual-amount">¥{{scope.row.money_actual}}</span>
          </template>
        </el-table-column>

        <el-table-column label="提现地址" prop="withdraw_address" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="address-text">{{scope.row.withdraw_address}}</span>
          </template>
        </el-table-column>

        <el-table-column label="网络类型" prop="withdraw_network" width="100">
          <template slot-scope="scope">
            <el-tag type="info" size="small">{{scope.row.withdraw_network}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="status" width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{getStatusText(scope.row.status)}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="申请时间" prop="create_time" width="160" sortable>
          <template slot-scope="scope">
            {{scope.row.create_time}}
          </template>
        </el-table-column>

        <el-table-column label="审核时间" prop="success_time" width="160">
          <template slot-scope="scope">
            <span :class="{'success-time': scope.row.success_time}">
              {{scope.row.success_time || '未审核'}}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDetail(scope.row)" icon="el-icon-view">
              详情
            </el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="small"
              @click="showAuditDialog(scope.row)"
              icon="el-icon-edit">
              审核
            </el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="small"
              @click="quickApprove(scope.row)"
              style="color: #67C23A">
              快速通过
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </el-card>

    <!-- 审核对话框 -->
    <el-dialog title="提现审核" :visible.sync="auditDialog.visible" width="700px" :close-on-click-modal="false">
      <el-form ref="auditForm" :model="auditForm" :rules="auditRules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单号：">
              <span class="form-text">{{auditForm.order_number}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户账号：">
              <span class="form-text">{{auditForm.user_name}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="提现金额：">
              <span class="form-text money-amount">¥{{auditForm.money}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手续费：">
              <span class="form-text fee-amount">¥{{auditForm.money_fee}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="实际到账：">
              <span class="form-text actual-amount">¥{{auditForm.money_actual}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户余额：">
              <span class="form-text">¥{{auditForm.money_balance}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 提现地址信息 -->
        <el-form-item label="提现地址：">
          <div class="address-info">
            <div><strong>地址：</strong>{{auditForm.withdraw_address}}</div>
            <div><strong>网络：</strong>{{auditForm.withdraw_network}}</div>
          </div>
        </el-form-item>

        <!-- 审核操作 -->
        <el-form-item label="审核结果：" prop="audit_status">
          <el-radio-group v-model="auditForm.audit_status">
            <el-radio :label="1">
              <span style="color: #67C23A">通过</span>
            </el-radio>
            <el-radio :label="2">
              <span style="color: #F56C6C">拒绝</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 交易哈希（通过时填写） -->
        <el-form-item
          v-if="auditForm.audit_status === 1"
          label="交易哈希："
          prop="transaction_hash">
          <el-input
            v-model="auditForm.transaction_hash"
            placeholder="请输入链上交易哈希（选填）"
            maxlength="100"/>
          <div class="form-tip">通过审核后可填写链上交易哈希，便于用户查询</div>
        </el-form-item>

        <!-- 审核备注 -->
        <el-form-item label="审核备注：" prop="msg">
          <el-input
            type="textarea"
            v-model="auditForm.msg"
            :placeholder="auditForm.audit_status === 2 ? '请输入拒绝理由（必填）' : '请输入审核备注（选填）'"
            :rows="3"
            maxlength="200"
            show-word-limit/>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="auditDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitAudit" :loading="auditDialog.loading">
          确定审核
        </el-button>
      </div>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog title="提现详情" :visible.sync="detailDialog.visible" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{detailData.order_number}}</el-descriptions-item>
        <el-descriptions-item label="用户账号">{{detailData.user_name}}</el-descriptions-item>
        <el-descriptions-item label="提现金额">
          <span class="money-amount">¥{{detailData.money}}</span>
        </el-descriptions-item>
        <el-descriptions-item label="手续费">
          <span class="fee-amount">¥{{detailData.money_fee}}</span>
        </el-descriptions-item>
        <el-descriptions-item label="实际到账">
          <span class="actual-amount">¥{{detailData.money_actual}}</span>
        </el-descriptions-item>
        <el-descriptions-item label="用户余额">¥{{detailData.money_balance}}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(detailData.status)">
            {{getStatusText(detailData.status)}}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="用户IP">{{detailData.user_ip}}</el-descriptions-item>
        <el-descriptions-item label="提现地址" :span="2">{{detailData.withdraw_address}}</el-descriptions-item>
        <el-descriptions-item label="网络类型">{{detailData.withdraw_network}}</el-descriptions-item>
        <el-descriptions-item label="验证码">{{detailData.verification_code || '-'}}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{detailData.create_time}}</el-descriptions-item>
        <el-descriptions-item label="审核时间">{{detailData.success_time || '未审核'}}</el-descriptions-item>
        <el-descriptions-item label="审核管理员">{{detailData.admin_name || '未审核'}}</el-descriptions-item>
        <el-descriptions-item label="交易哈希">{{detailData.transaction_hash || '-'}}</el-descriptions-item>
        <el-descriptions-item label="审核备注" :span="2">
          {{detailData.msg || '无'}}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPayListApi,
  gettPayPassApi,
  gettPayRefuseApi,
  getWithdrawStatisticsApi
} from '@/api/MoneylogApi'

export default {
  name: 'WithdrawList',
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,

      // 搜索参数
      searchParameter: {
        user_name: '',
        status: '',
        withdraw_address: '',
        dateRange: []
      },

      // 提现列表数据
      withdrawList: [],

      // 统计数据
      statistics: {},

      // 审核对话框
      auditDialog: {
        visible: false,
        loading: false
      },

      // 审核表单
      auditForm: {
        id: null,
        order_number: '',
        user_name: '',
        money: 0,
        money_fee: 0,
        money_actual: 0,
        money_balance: 0,
        withdraw_address: '',
        withdraw_network: '',
        audit_status: 1,
        transaction_hash: '',
        msg: ''
      },

      // 审核表单验证规则
      auditRules: {
        audit_status: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ],
        msg: [
          {
            validator: (rule, value, callback) => {
              if (this.auditForm.audit_status === 2 && !value) {
                callback(new Error('拒绝时必须填写审核备注'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      },

      // 详情对话框
      detailDialog: {
        visible: false
      },
      detailData: {}
    };
  },

  mounted() {
    this.loadData();
    this.loadStatistics();
  },

  methods: {
    // 加载数据
    async loadData() {
      this.loading = true;
      try {
        const params = {
          page: this.currentPage,
          limit: this.pageSize,
          ...this.searchParameter
        };

        // 处理日期范围
        if (this.searchParameter.dateRange && this.searchParameter.dateRange.length === 2) {
          params.start_date = this.searchParameter.dateRange[0];
          params.end_date = this.searchParameter.dateRange[1];
          delete params.dateRange;
        }

        const res = await getPayListApi(params);
        if (res.code === 1) {
          this.withdrawList = res.data.data || [];
          this.totalCount = res.data.total || 0;
        } else {
          this.$message.error(res.message || '加载数据失败');
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        this.$message.error('网络错误，请稍后重试');
      } finally {
        this.loading = false;
      }
    },

    // 加载统计数据
    async loadStatistics() {
      try {
        const res = await getWithdrawStatisticsApi();
        if (res.code === 1) {
          this.statistics = res.data;
        }
      } catch (error) {
        console.error('加载统计数据失败:', error);
      }
    },

    // 搜索
    search() {
      this.currentPage = 1;
      this.loadData();
    },

    // 重置搜索
    resetSearch() {
      this.searchParameter = {
        user_name: '',
        status: '',
        withdraw_address: '',
        dateRange: []
      };
      this.search();
    },

    // 分页改变
    handleCurrentChange(page) {
      this.currentPage = page;
      this.loadData();
    },

    // 页大小改变
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.loadData();
    },

    // 显示审核对话框
    showAuditDialog(row) {
      this.auditForm = {
        id: row.id,
        order_number: row.order_number,
        user_name: row.user_name,
        money: row.money,
        money_fee: row.money_fee,
        money_actual: row.money_actual,
        money_balance: row.money_balance,
        withdraw_address: row.withdraw_address,
        withdraw_network: row.withdraw_network,
        audit_status: 1,
        transaction_hash: '',
        msg: ''
      };
      this.auditDialog.visible = true;
    },

    // 快速通过
    async quickApprove(row) {
      try {
        await this.$confirm('确认快速通过该提现申请？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        const res = await gettPayPassApi({
          id: row.id,
          msg: '快速通过'
        });

        if (res.code === 1) {
          this.$message.success('审核成功');
          this.loadData();
          this.loadStatistics();
        } else {
          this.$message.error(res.message || '审核失败');
        }
      } catch (error) {
        // 用户取消操作或网络错误
        if (error !== 'cancel') {
          this.$message.error('网络错误');
        }
      }
    },

    // 提交审核
    async submitAudit() {
      try {
        await this.$refs.auditForm.validate();

        this.auditDialog.loading = true;

        let res;
        if (this.auditForm.audit_status === 1) {
          // 通过审核
          const params = {
            id: this.auditForm.id,
            msg: this.auditForm.msg
          };

          // 如果填写了交易哈希，则传递该参数
          if (this.auditForm.transaction_hash) {
            params.transaction_hash = this.auditForm.transaction_hash;
          }

          res = await gettPayPassApi(params);
        } else {
          // 拒绝审核
          res = await gettPayRefuseApi({
            id: this.auditForm.id,
            msg: this.auditForm.msg
          });
        }

        if (res.code === 1) {
          this.$message.success('审核成功');
          this.auditDialog.visible = false;
          this.loadData();
          this.loadStatistics();
        } else {
          this.$message.error(res.message || '审核失败');
        }
      } catch (error) {
        // 表单验证失败或网络错误
        if (error !== false) {
          this.$message.error('网络错误');
        }
      } finally {
        this.auditDialog.loading = false;
      }
    },

    // 显示详情
    showDetail(row) {
      this.detailData = { ...row };
      this.detailDialog.visible = true;
    },

    // 导出数据
    exportData() {
      this.$message.info('导出功能开发中...');
    },

    // 获取状态类型
    getStatusType(status) {
      const statusMap = {
        0: 'warning',  // 待审核
        1: 'success',  // 已通过
        2: 'danger'    // 已拒绝
      };
      return statusMap[status] || 'info';
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        0: '待审核',
        1: '已通过',
        2: '已拒绝'
      };
      return statusMap[status] || '未知';
    }
  }
}
</script>

<style lang='scss' scoped>
.page-content {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.search-card {
  margin-bottom: 20px;

  .el-row {
    .el-col {
      margin-bottom: 10px;
    }
  }
}

.stats-row {
  margin-bottom: 20px;
}

.stats-card {
  .stats-item {
    text-align: center;

    .stats-value {
      font-size: 24px;
      font-weight: bold;
      color: #409EFF;
      margin-bottom: 8px;
    }

    .stats-label {
      font-size: 14px;
      color: #909399;
    }
  }
}

.table-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.user-name {
  color: #409EFF;
  font-weight: 500;
}

.money-amount {
  color: #E6A23C;
  font-weight: bold;
}

.fee-amount {
  color: #F56C6C;
  font-size: 12px;
}

.actual-amount {
  color: #67C23A;
  font-weight: bold;
}

.address-text {
  font-family: monospace;
  font-size: 12px;
  color: #606266;
}

.success-time {
  color: #67C23A;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.form-text {
  color: #606266;
  font-weight: 500;
}

.address-info {
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;

  div {
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

// 响应式设计
@media (max-width: 768px) {
  .page-content {
    padding: 10px;
  }

  .stats-row {
    .el-col {
      margin-bottom: 10px;
    }
  }

  .el-table {
    font-size: 12px;
  }

  .address-text {
    font-size: 10px;
  }
}
</style>
