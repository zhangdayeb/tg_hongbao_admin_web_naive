<template>
  <div class='page-content'>
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-form label-width="80px">
        <!-- 第一行搜索条件 -->
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="用户名：">
              <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="用户ID：">
              <el-input v-model="searchForm.userId" placeholder="请输入用户ID" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="手机号：">
              <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="提现状态：">
              <el-select v-model="searchForm.status" clearable placeholder="请选择状态" style="width: 100%">
                <el-option label="待审核" value="0"></el-option>
                <el-option label="已通过" value="1"></el-option>
                <el-option label="已拒绝" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 第二行搜索条件 -->
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="支付方式：">
              <el-select v-model="searchForm.payType" clearable placeholder="请选择支付方式" style="width: 100%">
                <el-option 
                  v-for="method in paymentMethods" 
                  :key="method.type" 
                  :label="method.name" 
                  :value="method.type">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="申请时间：">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="金额范围：">
              <el-input-number v-model="searchForm.minAmount" placeholder="最小金额" style="width: 48%"></el-input-number>
              <span style="margin: 0 2%">-</span>
              <el-input-number v-model="searchForm.maxAmount" placeholder="最大金额" style="width: 48%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="审核员：">
              <el-select v-model="searchForm.adminName" clearable placeholder="请选择审核员" style="width: 100%">
                <el-option 
                  v-for="admin in adminUsers" 
                  :key="admin.id" 
                  :label="admin.nickname" 
                  :value="admin.username">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 第三行操作按钮 -->
        <el-row :gutter="20">
          <el-col :span="24" style="text-align: right;">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="success" plain @click="handleExport">导出</el-button>
            <el-button type="info" plain @click="loadStatistics">刷新统计</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    
   
    <!-- 操作按钮区域 -->
    <div class="action-section">
      <el-button type="primary" plain @click="handleBatchApprove" :disabled="!selectedRows.length">
        批量审核通过
      </el-button>
      <el-button type="danger" plain @click="handleBatchReject" :disabled="!selectedRows.length">
        批量拒绝
      </el-button>
      <el-button @click="handleRefresh">刷新</el-button>
      <span style="margin-left: 10px; color: #909399;">
        已选择 {{ selectedRows.length }} 条记录
      </span>
    </div>
    
    <!-- 数据表格 -->
    <el-table 
      :data="txianList" 
      border 
      style="margin-top: 15px"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      ref="table">
      
      <!-- 选择列 -->
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      
      <!-- 用户信息 -->
      <el-table-column label="用户信息" width="120">
        <template slot-scope="scope">
          <div class="user-info">
            <div class="username">{{ scope.row.userName }}</div>
            <div class="user-id">ID: {{ scope.row.uId }}</div>
            <div class="user-phone" v-if="scope.row.userPhone">{{ scope.row.userPhone }}</div>
          </div>
        </template>
      </el-table-column>
      
      <!-- 提现金额 -->
      <el-table-column label="提现金额" prop="money" width="120">
        <template slot-scope="scope">
          <div class="amount-info">
            <div class="main-amount">${{ scope.row.money }}</div>
          </div>
        </template>
      </el-table-column>
      
      <!-- 手续费 -->
      <el-table-column label="手续费" prop="moneyFee" width="100">
        <template slot-scope="scope">
          <span class="fee-amount">-${{ scope.row.moneyFee }}</span>
        </template>
      </el-table-column>
      
      <!-- 实际到账 -->
      <el-table-column label="实际到账" prop="momeyActual" width="120">
        <template slot-scope="scope">
          <span class="actual-amount">${{ scope.row.momeyActual }}</span>
        </template>
      </el-table-column>
      
      <!-- 收款信息 -->
      <el-table-column label="收款信息" width="200">
        <template slot-scope="scope">
          <div class="payment-info">
            <div class="pay-type">
              <el-tag size="mini" :type="getPayTypeColor(scope.row.payType)">
                {{ getPayTypeName(scope.row.payType) }}
              </el-tag>
            </div>
            <div class="account-info">
              <span>{{ scope.row.uBankName }}</span><br>
              <span class="account-number">{{ scope.row.uBackCard }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      
      <!-- 申请时间 -->
      <el-table-column label="申请时间" prop="createTime" width="160">
        <template slot-scope="scope">
          {{ formatDateTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      
      <!-- 状态 -->
      <el-table-column label="状态" prop="status" width="100">
        <template slot-scope="scope">
          <el-tag size="mini" :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <!-- 审核时间 -->
      <el-table-column label="审核时间" prop="successTime" width="160">
        <template slot-scope="scope">
          {{ scope.row.successTime ? formatDateTime(scope.row.successTime) : '-' }}
        </template>
      </el-table-column>
      
      <!-- 审核员 -->
      <el-table-column label="审核员" prop="adminName" width="100">
        <template slot-scope="scope">
          {{ scope.row.adminName || '-' }}
        </template>
      </el-table-column>
      
      <!-- 操作列 -->
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-view" @click="showDetail(scope.row)">
            详情
          </el-button>
          <el-button 
            v-if="scope.row.status === 0" 
            type="text" 
            icon="el-icon-check" 
            style="color: #67C23A"
            @click="showApproveDialog(scope.row)">
            审核
          </el-button>
          <el-button 
            v-if="scope.row.status === 0" 
            type="text" 
            icon="el-icon-close" 
            style="color: #F56C6C"
            @click="showRejectDialog(scope.row)">
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <template v-if="totalCount > 0">
      <el-pagination 
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        style="margin-top: 20px; text-align: right;">
      </el-pagination>
    </template>

    <!-- 审核对话框 -->
    <el-dialog title="审核提现申请" width="600px" :visible.sync="approveDialog.visible">
      <div class="approve-content">
        <el-descriptions title="提现详情" :column="2" border>
          <el-descriptions-item label="用户名">{{ approveDialog.data.userName }}</el-descriptions-item>
          <el-descriptions-item label="提现金额">${{ approveDialog.data.money }}</el-descriptions-item>
          <el-descriptions-item label="手续费">${{ approveDialog.data.moneyFee }}</el-descriptions-item>
          <el-descriptions-item label="实际到账">${{ approveDialog.data.momeyActual }}</el-descriptions-item>
          <el-descriptions-item label="支付方式">{{ getPayTypeName(approveDialog.data.payType) }}</el-descriptions-item>
          <el-descriptions-item label="收款账号">{{ approveDialog.data.uBackCard }}</el-descriptions-item>
          <el-descriptions-item label="收款人">{{ approveDialog.data.uBackUserName }}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ formatDateTime(approveDialog.data.createTime) }}</el-descriptions-item>
        </el-descriptions>
        
        <div style="margin-top: 20px;">
          <el-form label-width="80px">
            <el-form-item label="审核意见：">
              <el-input 
                v-model="approveDialog.remark" 
                type="textarea" 
                rows="3" 
                placeholder="请输入审核意见（可选）">
              </el-input>
            </el-form-item>
            <el-form-item label="操作密码：">
              <el-input 
                v-model="approveDialog.password" 
                type="password" 
                placeholder="请输入操作密码（可选）">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="approveDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleApprove" :loading="approveDialog.loading">确认通过</el-button>
      </span>
    </el-dialog>

    <!-- 拒绝对话框 -->
    <el-dialog title="拒绝提现申请" width="500px" :visible.sync="rejectDialog.visible">
      <el-form label-width="80px">
        <el-form-item label="拒绝原因：" required>
          <el-input 
            v-model="rejectDialog.reason" 
            type="textarea" 
            rows="4" 
            placeholder="请输入拒绝原因">
          </el-input>
        </el-form-item>
        <el-form-item label="操作密码：">
          <el-input 
            v-model="rejectDialog.password" 
            type="password" 
            placeholder="请输入操作密码（可选）">
          </el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectDialog.visible = false">取消</el-button>
        <el-button type="danger" @click="handleReject" :loading="rejectDialog.loading">确认拒绝</el-button>
      </span>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog title="提现详情" width="700px" :visible.sync="detailDialog.visible">
      <el-descriptions :column="2" border v-if="detailDialog.data">
        <el-descriptions-item label="用户ID">{{ detailDialog.data.uId }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ detailDialog.data.userName }}</el-descriptions-item>
        <el-descriptions-item label="提现金额">${{ detailDialog.data.money }}</el-descriptions-item>
        <el-descriptions-item label="账户余额">${{ detailDialog.data.moneyBalance }}</el-descriptions-item>
        <el-descriptions-item label="手续费">${{ detailDialog.data.moneyFee }}</el-descriptions-item>
        <el-descriptions-item label="实际到账">${{ detailDialog.data.momeyActual }}</el-descriptions-item>
        <el-descriptions-item label="支付方式">{{ getPayTypeName(detailDialog.data.payType) }}</el-descriptions-item>
        <el-descriptions-item label="收款银行">{{ detailDialog.data.uBankName }}</el-descriptions-item>
        <el-descriptions-item label="收款账号">{{ detailDialog.data.uBackCard }}</el-descriptions-item>
        <el-descriptions-item label="收款人">{{ detailDialog.data.uBackUserName }}</el-descriptions-item>
        <el-descriptions-item label="用户IP">{{ detailDialog.data.uIp }}</el-descriptions-item>
        <el-descriptions-item label="用户地区">{{ detailDialog.data.uCity || '-' }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ formatDateTime(detailDialog.data.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="审核时间">{{ detailDialog.data.successTime ? formatDateTime(detailDialog.data.successTime) : '-' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(detailDialog.data.status)">
            {{ getStatusText(detailDialog.data.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="备注">{{ detailDialog.data.msg || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserPayCashListApi,
  getUserPayCashDetailApi,
  getUserPayCashApproveApi,
  getUserPayCashBatchApproveApi,
  getUserPayCashStatisticsApi,
  getUserPayCashExportApi,
  getPaymentMethodsApi,
  getAdminUsersApi,
  getUserPayCashPassApi,
  getUserPayCashRejectApi,
  getUserPayCashBatchPassApi,
  getUserPayCashBatchRejectApi
} from '@/api/UserPayCashApi'

export default {
  name: 'UserTxianList',
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      searchForm: {
        username: '',
        userId: '',
        phone: '',
        status: '',
        payType: '',
        dateRange: [],
        minAmount: null,
        maxAmount: null,
        adminName: ''
      },
      selectedRows: [],
      txianList: [],
      statistics: null,
      paymentMethods: [],
      adminUsers: [],
      approveDialog: {
        visible: false,
        loading: false,
        data: {},
        remark: '',
        password: ''
      },
      rejectDialog: {
        visible: false,
        loading: false,
        data: {},
        reason: '',
        password: ''
      },
      detailDialog: {
        visible: false,
        data: {}
      }
    };
  },
  mounted() {
    this.loadData();
    this.loadPaymentMethods();
    this.loadAdminUsers();
    this.loadStatistics();
  },
  methods: {
    // 加载列表数据
    async loadData() {
      this.loading = true;
      try {
        const params = this.buildQueryParams();
        const res = await getUserPayCashListApi(params);
        
        if (res.code === 1) {
          this.txianList = res.data.data || [];
          this.totalCount = parseInt(res.data.total) || 0;
          this.currentPage = parseInt(res.data.current_page) || 1;
          this.pageSize = parseInt(res.data.per_page) || 10;
          
          // 如果返回了统计数据，也更新统计信息
          if (res.data.statistics) {
            this.statistics = res.data.statistics;
          }
        } else {
          this.$message.error(res.message || '获取数据失败');
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
        const params = this.buildStatisticsParams();
        const res = await getUserPayCashStatisticsApi(params);
        
        if (res.code === 1) {
          this.statistics = res.data;
        }
      } catch (error) {
        console.error('加载统计数据失败:', error);
      }
    },

    // 加载支付方式
    async loadPaymentMethods() {
      try {
        const res = await getPaymentMethodsApi();
        if (res.code === 1) {
          this.paymentMethods = res.data || [];
        }
      } catch (error) {
        console.error('加载支付方式失败:', error);
      }
    },

    // 加载管理员列表
    async loadAdminUsers() {
      try {
        const res = await getAdminUsersApi();
        if (res.code === 1) {
          this.adminUsers = res.data || [];
        }
      } catch (error) {
        console.error('加载管理员列表失败:', error);
      }
    },

    // 构建查询参数
    buildQueryParams() {
      const params = {
        page: parseInt(this.currentPage),
        limit: parseInt(this.pageSize)
      };

      // 添加搜索条件
      if (this.searchForm.username) params.username = this.searchForm.username;
      if (this.searchForm.userId) params.userId = parseInt(this.searchForm.userId);
      if (this.searchForm.phone) params.phone = this.searchForm.phone;
      if (this.searchForm.status !== '') params.status = parseInt(this.searchForm.status);
      if (this.searchForm.payType) params.payType = this.searchForm.payType;
      if (this.searchForm.adminName) params.adminName = this.searchForm.adminName;
      if (this.searchForm.minAmount) params.minAmount = parseFloat(this.searchForm.minAmount);
      if (this.searchForm.maxAmount) params.maxAmount = parseFloat(this.searchForm.maxAmount);

      // 处理时间范围
      if (this.searchForm.dateRange && this.searchForm.dateRange.length === 2) {
        params.start = this.searchForm.dateRange[0];
        params.end = this.searchForm.dateRange[1];
      }

      return params;
    },

    // 构建统计参数
    buildStatisticsParams() {
      const params = {};
      
      if (this.searchForm.status !== '') params.status = parseInt(this.searchForm.status);
      if (this.searchForm.dateRange && this.searchForm.dateRange.length === 2) {
        params.start = this.searchForm.dateRange[0];
        params.end = this.searchForm.dateRange[1];
      }

      return params;
    },

    // 分页处理
    handleCurrentChange(page) {
      this.currentPage = parseInt(page);
      this.loadData();
    },

    handleSizeChange(size) {
      this.pageSize = parseInt(size);
      this.currentPage = 1;
      this.loadData();
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1;
      this.loadData();
      this.loadStatistics();
    },

    // 重置
    handleReset() {
      this.searchForm = {
        username: '',
        userId: '',
        phone: '',
        status: '',
        payType: '',
        dateRange: [],
        minAmount: null,
        maxAmount: null,
        adminName: ''
      };
      this.currentPage = 1;
      this.loadData();
      this.loadStatistics();
    },

    // 导出
    async handleExport() {
      try {
        const params = this.buildQueryParams();
        delete params.page;
        delete params.limit;
        
        const res = await getUserPayCashExportApi(params);
        if (res.code === 1) {
          this.$message.success('导出成功');
          // 这里可以处理下载逻辑
          if (res.data.downloadUrl) {
            window.open(res.data.downloadUrl);
          }
        } else {
          this.$message.error(res.message || '导出失败');
        }
      } catch (error) {
        console.error('导出失败:', error);
        this.$message.error('导出失败，请稍后重试');
      }
    },

    // 刷新
    handleRefresh() {
      this.loadData();
      this.loadStatistics();
    },

    // 选择变化
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },

    // 批量审核通过
    handleBatchApprove() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要审核的记录');
        return;
      }

      const pendingRows = this.selectedRows.filter(row => row.status === 0);
      if (pendingRows.length === 0) {
        this.$message.warning('所选记录中没有待审核的申请');
        return;
      }

      this.$confirm(`确定要批量通过 ${pendingRows.length} 条提现申请吗？`, '确认操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const ids = pendingRows.map(row => row.id);
          const res = await getUserPayCashBatchPassApi({ ids });
          
          if (res.code === 1) {
            this.$message.success(res.message || '批量审核通过成功');
            this.selectedRows = [];
            this.loadData();
            this.loadStatistics();
          } else {
            this.$message.error(res.message || '批量审核失败');
          }
        } catch (error) {
          console.error('批量审核失败:', error);
          this.$message.error('操作失败，请稍后重试');
        }
      });
    },

    // 批量拒绝
    handleBatchReject() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要拒绝的记录');
        return;
      }

      const pendingRows = this.selectedRows.filter(row => row.status === 0);
      if (pendingRows.length === 0) {
        this.$message.warning('所选记录中没有待审核的申请');
        return;
      }

      this.$prompt('请输入拒绝原因', '批量拒绝', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputValidator: (value) => {
          if (!value || !value.trim()) {
            return '请输入拒绝原因';
          }
          return true;
        }
      }).then(async ({ value }) => {
        try {
          const ids = pendingRows.map(row => row.id);
          const res = await getUserPayCashBatchRejectApi({ 
            ids, 
            reason: value 
          });
          
          if (res.code === 1) {
            this.$message.success(res.message || '批量拒绝成功');
            this.selectedRows = [];
            this.loadData();
            this.loadStatistics();
          } else {
            this.$message.error(res.message || '批量拒绝失败');
          }
        } catch (error) {
          console.error('批量拒绝失败:', error);
          this.$message.error('操作失败，请稍后重试');
        }
      });
    },

    // 显示审核对话框
    showApproveDialog(row) {
      this.approveDialog.data = { ...row };
      this.approveDialog.remark = '';
      this.approveDialog.password = '';
      this.approveDialog.visible = true;
    },

    // 显示拒绝对话框
    showRejectDialog(row) {
      this.rejectDialog.data = { ...row };
      this.rejectDialog.reason = '';
      this.rejectDialog.password = '';
      this.rejectDialog.visible = true;
    },

    // 显示详情
    async showDetail(row) {
      try {
        const res = await getUserPayCashDetailApi({ id: row.id });
        if (res.code === 1) {
          this.detailDialog.data = res.data;
          this.detailDialog.visible = true;
        } else {
          this.$message.error(res.message || '获取详情失败');
        }
      } catch (error) {
        console.error('获取详情失败:', error);
        this.$message.error('获取详情失败，请稍后重试');
      }
    },

    // 审核通过
    async handleApprove() {
      this.approveDialog.loading = true;
      try {
        const res = await getUserPayCashPassApi({
          id: this.approveDialog.data.id,
          remark: this.approveDialog.remark,
          password: this.approveDialog.password
        });

        if (res.code === 1) {
          this.$message.success(res.message || '审核通过成功');
          this.approveDialog.visible = false;
          this.loadData();
          this.loadStatistics();
        } else {
          this.$message.error(res.message || '审核失败');
        }
      } catch (error) {
        console.error('审核失败:', error);
        this.$message.error('操作失败，请稍后重试');
      } finally {
        this.approveDialog.loading = false;
      }
    },

    // 拒绝申请
    async handleReject() {
      if (!this.rejectDialog.reason.trim()) {
        this.$message.warning('请输入拒绝原因');
        return;
      }

      this.rejectDialog.loading = true;
      try {
        const res = await getUserPayCashRejectApi({
          id: this.rejectDialog.data.id,
          reason: this.rejectDialog.reason,
          password: this.rejectDialog.password
        });

        if (res.code === 1) {
          this.$message.success(res.message || '已拒绝该提现申请');
          this.rejectDialog.visible = false;
          this.loadData();
          this.loadStatistics();
        } else {
          this.$message.error(res.message || '操作失败');
        }
      } catch (error) {
        console.error('拒绝失败:', error);
        this.$message.error('操作失败，请稍后重试');
      } finally {
        this.rejectDialog.loading = false;
      }
    },

    // 获取状态类型
    getStatusType(status) {
      switch (status) {
        case 0: return 'warning';  // 待审核
        case 1: return 'warning';  // 待审核
        case 2: return 'success';   // 已通过
        case 3: return 'danger';   // 已拒绝
        default: return 'info';
      }
    },

    // 获取状态文本
    getStatusText(status) {
      switch (status) {
        case 0: return '待审核';
        case 1: return '处理中';
        case 2: return '已通过';
        case 3: return '已拒绝';
        default: return '未知';
      }
    },

    // 获取支付方式名称
    getPayTypeName(payType) {
      const method = this.paymentMethods.find(m => m.type === payType);
      return method ? method.name : payType;
    },

    // 获取支付方式颜色
    getPayTypeColor(payType) {
      switch (payType) {
        case 'usdt': return 'success';
        case 'huiwang': return 'primary';
        case 'aba': return 'warning';
        default: return 'info';
      }
    },

    // 格式化日期时间
    formatDateTime(datetime) {
      if (!datetime) return '-';
      return datetime.replace('T', ' ').substring(0, 19);
    }
  }
}
</script>

<style lang='scss' scoped>
.page-content {
  width: 100%;
  height: 100%;
  
  .search-section {
    background: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .statistics-section {
    background: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    
    .stat-item {
      text-align: center;
      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
        
        &.stat-pending {
          color: #E6A23C;
        }
        
        &.stat-approved {
          color: #67C23A;
        }
        
        &.stat-rejected {
          color: #F56C6C;
        }
      }
      
      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-top: 5px;
      }
    }
  }
  
  .action-section {
    margin-bottom: 15px;
    padding: 10px 0;
  }
  
  .user-info {
    .username {
      font-weight: bold;
      color: #303133;
    }
    .user-id {
      font-size: 12px;
      color: #909399;
      margin-top: 2px;
    }
    .user-phone {
      font-size: 12px;
      color: #606266;
      margin-top: 2px;
    }
  }
  
  .amount-info {
    .main-amount {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
    }
  }
  
  .fee-amount {
    color: #F56C6C;
    font-weight: bold;
  }
  
  .actual-amount {
    color: #67C23A;
    font-weight: bold;
    font-size: 14px;
  }
  
  .payment-info {
    .pay-type {
      margin-bottom: 5px;
    }
    .account-info {
      font-size: 12px;
      color: #606266;
      .account-number {
        color: #909399;
        word-break: break-all;
      }
    }
  }
  
  .approve-content {
    .el-descriptions {
      margin-bottom: 20px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .page-content {
    .el-form {
      .el-row {
        .el-col {
          margin-bottom: 10px;
        }
      }
    }
    
    .amount-info .main-amount {
      font-size: 14px;
    }
    
    .statistics-section {
      .stat-item .stat-value {
        font-size: 18px;
      }
    }
  }
}
</style>